# QR Code Attendance System

This project is a web application that automates the attendance gathering process in the classroom using QR codes. The instructor of the section can generate a table of attendance for a certain date range, which can then be downloaded as an Excel file. The admin can view all the students, instructors, and admins, and users can request to be an instructor or an admin. The admin can accept or reject these requests. The admin also has access to all the school's classes and can view all the attendance sheets.

## Features

- QR code-based attendance gathering
- Attendance table generation for a specified date range
- Downloadable attendance table in Excel format
- User roles: admin, instructor, and student
- User registration and login
- Request to be an instructor or admin
- Admin approval or rejection of requests
- Access to all the school's classes
- View all attendance sheets

## Technologies Used

- Django
- Django Rest Framework
- MySQL
- AngularJS

## Installation

1. Clone the repository: `git clone https://github.com/username/qr-code-attendance-system.git`
2. Navigate to the project directory: `cd qr-code-attendance-system`
3. Create a virtual environment: `python -m venv env`
4. Activate the virtual environment:
   - On Windows: `.\env\Scripts\activate`
   - On macOS or Linux: `source env/bin/activate`
5. Install the required packages: `pip install -r requirements.txt`
6. Create the database tables: `python manage.py migrate`
7. Run the Django development server: `python manage.py runserver`
8. Open your web browser and go to `http://localhost:8000`

## Usage

1. Register as a user with the desired role (admin, instructor, or student).
2. Login with your credentials.
3. Generate a QR code for the section you are teaching or attending.
4. Use a smartphone or other device to scan the QR code and mark your attendance.
5. Generate an attendance table for a specified date range and download it in Excel format.
6. Request to be an instructor or admin (if you are a student).
7. Admins can approve or reject instructor or admin requests.
8. Admins can view all the school's classes and attendance sheets.

## Contributors

- Jayvee Ascano

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
