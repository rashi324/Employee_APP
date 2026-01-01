from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from datetime import date, datetime

app = Flask(__name__)
CORS(app)

DB = "database.db"

# ---------------- DATABASE CONNECTION ----------------
def get_db():
    return sqlite3.connect(DB)

# ---------------- INIT DATABASE ----------------
def init_db():
    conn = get_db()
    cur = conn.cursor()

    # Employees table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        role TEXT,
        salary INTEGER
    )
    """)

    # Attendance table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        emp_id INTEGER,
        date TEXT,
        clock_in TEXT,
        clock_out TEXT
    )
    """)

    # Users table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT
    )
    """)

    # Insert default admin user
    cur.execute("""
    INSERT OR IGNORE INTO users (username, password, role)
    VALUES ('admin', 'admin123', 'admin')
    """)

    conn.commit()
    conn.close()

# Initialize DB
init_db()

# ---------------- LOGIN ----------------
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    conn = get_db()
    cur = conn.cursor()

    cur.execute(
        "SELECT role FROM users WHERE username=? AND password=?",
        (data["username"], data["password"])
    )

    user = cur.fetchone()
    conn.close()

    if user:
        return jsonify({"success": True, "role": user[0]})
    else:
        return jsonify({"success": False}), 401

# ---------------- SIGNUP ----------------
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    name = data.get("name")
    username = data.get("username")
    password = data.get("password")

    if not all([name, username, password]):
        return jsonify({"error": "Missing required fields"}), 400

    conn = get_db()
    cur = conn.cursor()

    try:
        # Create employee record
        cur.execute(
            "INSERT INTO employees (name, role, salary) VALUES (?, ?, ?)",
            (name, "employee", 50000)  # Default role and salary
        )
        
        # Create user record
        cur.execute(
            "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
            (username, password, "employee")
        )
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({"error": "Username already exists"}), 409
    
    conn.close()
    return jsonify({"success": True, "message": "Signup successful"})

# ---------------- EMPLOYEES ----------------
@app.route("/employees", methods=["GET", "POST"])
def employees():
    conn = get_db()
    cur = conn.cursor()

    if request.method == "POST":
        data = request.json
        cur.execute(
            "INSERT INTO employees (name, role, salary) VALUES (?, ?, ?)",
            (data["name"], data["role"], data["salary"])
        )
        conn.commit()

    cur.execute("SELECT * FROM employees")
    rows = cur.fetchall()
    conn.close()

    return jsonify(rows)

# ---------------- ATTENDANCE ----------------
@app.route("/attendance", methods=["POST"])
def attendance():
    data = request.json
    emp_id = data.get("emp_id")
    action = data.get("action")
    
    if not emp_id or not action:
        return jsonify({"error": "emp_id and action are required"}), 400

    conn = get_db()
    cur = conn.cursor()
    current_date = date.today().isoformat()
    current_time = datetime.now().isoformat(sep=' ', timespec='seconds')

    if action == "clock_in":
        # Check if already clocked in for today
        cur.execute(
            "SELECT id FROM attendance WHERE emp_id=? AND date=? AND clock_out IS NULL",
            (emp_id, current_date)
        )
        existing_clock_in = cur.fetchone()

        if existing_clock_in:
            conn.close()
            return jsonify({"error": "Already clocked in"}), 409
        
        cur.execute(
            "INSERT INTO attendance (emp_id, date, clock_in) VALUES (?, ?, ?)",
            (emp_id, current_date, current_time)
        )
        conn.commit()
        conn.close()
        return jsonify({"message": "Clocked in successfully"})

    elif action == "clock_out":
        # Find the latest clock-in for today that hasn't been clocked out yet
        cur.execute(
            "SELECT id FROM attendance WHERE emp_id=? AND date=? AND clock_out IS NULL ORDER BY clock_in DESC LIMIT 1",
            (emp_id, current_date)
        )
        latest_clock_in_record = cur.fetchone()

        if not latest_clock_in_record:
            conn.close()
            return jsonify({"error": "No active clock-in found for today"}), 404
        
        record_id = latest_clock_in_record[0]
        cur.execute(
            "UPDATE attendance SET clock_out=? WHERE id=?",
            (current_time, record_id)
        )
        conn.commit()
        conn.close()
        return jsonify({"message": "Clocked out successfully"})

    else:
        conn.close()
        return jsonify({"error": "Invalid action"}), 400

@app.route("/attendance/<int:emp_id>", methods=["GET"])
def get_employee_attendance(emp_id):
    conn = get_db()
    cur = conn.cursor()

    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    query = "SELECT * FROM attendance WHERE emp_id=?"
    params = [emp_id]

    if start_date:
        query += " AND date >= ?"
        params.append(start_date)
    if end_date:
        query += " AND date <= ?"
        params.append(end_date)
    
    query += " ORDER BY date DESC, clock_in DESC"

    cur.execute(query, params)
    
    # Convert list of tuples to list of dictionaries
    records = []
    for row in cur.fetchall():
        records.append({
            "id": row[0],
            "emp_id": row[1],
            "date": row[2],
            "clock_in": row[3],
            "clock_out": row[4]
        })
        
    conn.close()

    return jsonify(records)


# ---------------- SALARY ----------------
@app.route("/salary/<int:emp_id>")
def salary(emp_id):
    conn = get_db()
    cur = conn.cursor()

    # Get basic salary
    cur.execute("SELECT salary FROM employees WHERE id=?", (emp_id,))
    salary_row = cur.fetchone()
    if not salary_row:
        conn.close()
        return jsonify({"error": "Employee not found"}), 404

    salary = salary_row[0]

    # Count absent days (assuming a full workday is 8 hours, and anything less than 4 hours is considered half day absent, less than 8 hours is considered full day absent)
    # This logic needs to be refined based on actual requirements. For now, we'll keep it simple: if there's no clock_in/clock_out for a day, it's an absent day.
    cur.execute(
        "SELECT COUNT(DISTINCT date) FROM attendance WHERE emp_id=? AND clock_in IS NULL AND clock_out IS NULL",
        (emp_id,)
    )
    absent_days = cur.fetchone()[0]

    # Calculate final salary
    deduction = absent_days * 500
    final_salary = salary - deduction

    conn.close()

    return jsonify({
        "basic": salary,
        "absent_days": absent_days,
        "deduction": deduction,
        "final_salary": final_salary
    })

# ---------------- RUN ----------------
if __name__ == "__main__":
    app.run(debug=True)
