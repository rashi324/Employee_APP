import unittest
import json
import os
from datetime import date, datetime, timedelta
import sqlite3

from app import app, get_db, init_db, DB

class FlaskAppTests(unittest.TestCase):

    def setUp(self):
        # Set up a test database
        app.config['TESTING'] = True
        app.config['DATABASE'] = ':memory:'
        self.app = app.test_client()
        with app.app_context():
            # Ensure a fresh database for each test
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("DROP TABLE IF EXISTS employees")
            cursor.execute("DROP TABLE IF EXISTS attendance")
            cursor.execute("DROP TABLE IF EXISTS users")
            conn.commit()
            conn.close()
            init_db()

        # Add a test employee and user
        with app.app_context():
            conn = get_db()
            cur = conn.cursor()
            cur.execute("INSERT INTO employees (name, role, salary) VALUES (?, ?, ?)", ("Test Employee", "staff", 50000))
            cur.execute("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", ("testuser", "testpass", "employee"))
            conn.commit()
            conn.close()
    
    def tearDown(self):
        # Clean up the test database (optional for in-memory, but good practice)
        with app.app_context():
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("DROP TABLE IF EXISTS employees")
            cursor.execute("DROP TABLE IF EXISTS attendance")
            cursor.execute("DROP TABLE IF EXISTS users")
            conn.commit()
            conn.close()

    def test_login_success(self):
        response = self.app.post('/login', json={'username': 'admin', 'password': 'admin123'})
        self.assertEqual(response.status_code, 200)
        self.assertIn('success', json.loads(response.data))
        self.assertTrue(json.loads(response.data)['success'])

    def test_login_fail(self):
        response = self.app.post('/login', json={'username': 'admin', 'password': 'wrongpassword'})
        self.assertEqual(response.status_code, 401)
        self.assertIn('success', json.loads(response.data))
        self.assertFalse(json.loads(response.data)['success'])

    def test_clock_in_success(self):
        response = self.app.post('/attendance', json={'emp_id': 1, 'action': 'clock_in'})
        self.assertEqual(response.status_code, 200)
        self.assertIn('message', json.loads(response.data))
        self.assertEqual(json.loads(response.data)['message'], 'Clocked in successfully')

        with app.app_context():
            conn = get_db()
            cur = conn.cursor()
            cur.execute("SELECT * FROM attendance WHERE emp_id=1 AND date=?", (date.today().isoformat(),))
            record = cur.fetchone()
            self.assertIsNotNone(record)
            self.assertIsNotNone(record[3]) # clock_in should not be null
            self.assertIsNone(record[4]) # clock_out should be null
            conn.close()

    def test_duplicate_clock_in(self):
        self.app.post('/attendance', json={'emp_id': 1, 'action': 'clock_in'})
        response = self.app.post('/attendance', json={'emp_id': 1, 'action': 'clock_in'})
        self.assertEqual(response.status_code, 409) # Conflict
        self.assertIn('error', json.loads(response.data))
        self.assertEqual(json.loads(response.data)['error'], 'Already clocked in')

    def test_clock_out_success(self):
        self.app.post('/attendance', json={'emp_id': 1, 'action': 'clock_in'})
        response = self.app.post('/attendance', json={'emp_id': 1, 'action': 'clock_out'})
        self.assertEqual(response.status_code, 200)
        self.assertIn('message', json.loads(response.data))
        self.assertEqual(json.loads(response.data)['message'], 'Clocked out successfully')

        with app.app_context():
            conn = get_db()
            cur = conn.cursor()
            cur.execute("SELECT * FROM attendance WHERE emp_id=1 AND date=?", (date.today().isoformat(),))
            record = cur.fetchone()
            self.assertIsNotNone(record)
            self.assertIsNotNone(record[3]) # clock_in should not be null
            self.assertIsNotNone(record[4]) # clock_out should not be null
            conn.close()

    def test_clock_out_without_clock_in(self):
        response = self.app.post('/attendance', json={'emp_id': 1, 'action': 'clock_out'})
        self.assertEqual(response.status_code, 404) # Not Found
        self.assertIn('error', json.loads(response.data))
        self.assertEqual(json.loads(response.data)['error'], 'No active clock-in found for today')

    def test_get_employee_attendance(self):
        # Clock in and out for today
        self.app.post('/attendance', json={'emp_id': 1, 'action': 'clock_in'})
        self.app.post('/attendance', json={'emp_id': 1, 'action': 'clock_out'})

        # Clock in for yesterday (simulate)
        yesterday = (date.today() - timedelta(days=1)).isoformat()
        with app.app_context():
            conn = get_db()
            cur = conn.cursor()
            cur.execute("INSERT INTO attendance (emp_id, date, clock_in, clock_out) VALUES (?, ?, ?, ?)",
                        (1, yesterday, f"{yesterday} 09:00:00", f"{yesterday} 17:00:00"))
            conn.commit()
            conn.close()

        response = self.app.get('/attendance/1')
        self.assertEqual(response.status_code, 200)
        records = json.loads(response.data)
        self.assertEqual(len(records), 2) # Should get 2 records

        response_filtered = self.app.get(f'/attendance/1?start_date={yesterday}&end_date={yesterday}')
        self.assertEqual(response_filtered.status_code, 200)
        records_filtered = json.loads(response_filtered.data)
        self.assertEqual(len(records_filtered), 1) # Should get 1 record

    def test_salary_calculation_no_absent(self):
        # Clock in and out for today
        self.app.post('/attendance', json={'emp_id': 1, 'action': 'clock_in'})
        self.app.post('/attendance', json={'emp_id': 1, 'action': 'clock_out'})
        
        response = self.app.get('/salary/1')
        self.assertEqual(response.status_code, 200)
        salary_data = json.loads(response.data)
        self.assertEqual(salary_data['basic'], 50000)
        self.assertEqual(salary_data['absent_days'], 0)
        self.assertEqual(salary_data['deduction'], 0)
        self.assertEqual(salary_data['final_salary'], 50000)

    def test_salary_calculation_with_absent(self):
        # Simulate an absent day by not clocking in/out for a day, and creating a dummy record
        # for a previous day without clock in/out. This fits the current backend logic for 'absent_days'.
        absent_day = (date.today() - timedelta(days=2)).isoformat()
        with app.app_context():
            conn = get_db()
            cur = conn.cursor()
            cur.execute("INSERT INTO attendance (emp_id, date, clock_in, clock_out) VALUES (?, ?, ?, ?)",
                        (1, absent_day, None, None))
            conn.commit()
            conn.close()

        response = self.app.get('/salary/1')
        self.assertEqual(response.status_code, 200)
        salary_data = json.loads(response.data)
        self.assertEqual(salary_data['basic'], 50000)
        self.assertEqual(salary_data['absent_days'], 1) # One absent day
        self.assertEqual(salary_data['deduction'], 500) # 1 * 500
        self.assertEqual(salary_data['final_salary'], 49500) # 50000 - 500


if __name__ == '__main__':
    unittest.main()
