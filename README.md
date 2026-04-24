# GCP Cloud Summit 2024 - 1-Day Technical Conference Website

A premium, responsive website for a 1-day technical conference focused on Google Cloud Technologies. Built with **Python (Flask)** on the backend and **Vanilla HTML, CSS, and JavaScript** on the frontend.

## Features

- **Dynamic Schedule**: 8 technical talks + 1 lunch break with detailed information.
- **Premium Design**: Modern aesthetics featuring Google Cloud colors, glassmorphism, and smooth animations.
- **Real-time Search**: Filter talks by title, speaker, or category instantly.
- **Speaker Profiles**: Links to speaker LinkedIn profiles.
- **RYZEN Walk Integration**: Displays specific "RYZEN Walk" times for each session.
- **Responsive Layout**: Fully optimized for mobile, tablet, and desktop.

## Tech Stack

- **Backend**: Python 3, Flask
- **Frontend**: HTML5, Vanilla CSS3 (Custom Variables, Flexbox), Vanilla JavaScript (ES6+)
- **Design**: Google Fonts (Inter), Custom-generated hero imagery.

## Setup and Installation

### 1. Prerequisites
- Python 3.x installed on your system.

### 2. Clone/Extract the Project
Ensure you are in the project root directory:
```bash
cd amd-slingshot-2026
```

### 3. Install Dependencies
```bash
pip install Flask
```

### 4. Run the Application
```bash
python app.py
```
The application will start on `http://127.0.0.1:5001`.

## Project Structure

- `app.py`: Main Flask server and data model.
- `templates/`: HTML templates (Jinja2).
- `static/css/`: Custom styling.
- `static/js/`: Client-side logic for search and animations.
- `static/img/`: Project assets (hero image).

## Making Further Changes

### Adding/Modifying Talks
Open `app.py` and update the `CONFERENCE_DATA` dictionary. Each talk follows this structure:
```python
{
    "id": "Txxx",
    "title": "Talk Title",
    "speakers": [{"firstName": "Name", "lastName": "Surname", "linkedin": "URL"}],
    "category": "Category Name",
    "description": "Short description...",
    "startTime": "HH:MM AM/PM",
    "endTime": "HH:MM AM/PM",
    "ryzenWalkTime": "HH:MM AM/PM"
}
```

### Customizing Styles
Modify `static/css/style.css`. You can change the global theme by updating the CSS variables in the `:root` selector.

### Modifying Search Logic
Update `static/js/main.js` to change how filtering works or add new UI interactions.

## License
MIT