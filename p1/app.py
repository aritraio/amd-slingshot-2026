from flask import Flask, render_template, jsonify
from datetime import datetime

app = Flask(__name__)

# Dummy Data for Google Cloud Technical Conference
CONFERENCE_DATA = {
    "name": "GCP Cloud Summit 2024",
    "date": datetime.now().strftime("%B %d, %Y"),
    "location": "San Francisco, CA & Virtual",
    "talks": [
        {
            "id": "T001",
            "title": "Unleashing Generative AI with Vertex AI",
            "speakers": [
                {"firstName": "Sarah", "lastName": "Chen", "linkedin": "https://linkedin.com/in/sarahchen"},
                {"firstName": "Mark", "lastName": "Johnson", "linkedin": "https://linkedin.com/in/markj"}
            ],
            "category": "AI & ML",
            "description": "Explore the latest Gemini models and learn how to build production-ready GenAI apps on Google Cloud.",
            "startTime": "09:00 AM",
            "endTime": "09:45 AM",
            "ryzenWalkTime": "09:30 AM"
        },
        {
            "id": "T002",
            "title": "Scalable Data Analytics with BigQuery",
            "speakers": [
                {"firstName": "Anita", "lastName": "Desai", "linkedin": "https://linkedin.com/in/anitadesai"}
            ],
            "category": "Data & Analytics",
            "description": "Deep dive into BigQuery's latest features for serverless data warehousing and real-time analytics.",
            "startTime": "09:45 AM",
            "endTime": "10:30 AM",
            "ryzenWalkTime": "10:15 AM"
        },
        {
            "id": "T003",
            "title": "Serverless Excellence with Cloud Run",
            "speakers": [
                {"firstName": "David", "lastName": "Miller", "linkedin": "https://linkedin.com/in/davidm"},
                {"firstName": "Elena", "lastName": "Rodriguez", "linkedin": "https://linkedin.com/in/elenar"}
            ],
            "category": "DevOps",
            "description": "Learn how to deploy containerized applications effortlessly using Cloud Run and Eventarc.",
            "startTime": "10:30 AM",
            "endTime": "11:15 AM",
            "ryzenWalkTime": "11:00 AM"
        },
        {
            "id": "T004",
            "title": "Mastering GKE and Anthos",
            "speakers": [
                {"firstName": "Kevin", "lastName": "Lee", "linkedin": "https://linkedin.com/in/kevinlee"}
            ],
            "category": "Infrastructure",
            "description": "Advanced Kubernetes patterns for multi-cluster management and hybrid cloud deployments.",
            "startTime": "11:15 AM",
            "endTime": "12:00 PM",
            "ryzenWalkTime": "11:45 AM"
        },
        {
            "id": "LUNCH",
            "title": "Networking Lunch Break",
            "speakers": [],
            "category": "Break",
            "description": "Enjoy a catered lunch and network with fellow cloud enthusiasts.",
            "startTime": "12:00 PM",
            "endTime": "01:00 PM",
            "ryzenWalkTime": "N/A"
        },
        {
            "id": "T005",
            "title": "Zero Trust Security on GCP",
            "speakers": [
                {"firstName": "Rachel", "lastName": "Green", "linkedin": "https://linkedin.com/in/rachelgreen"}
            ],
            "category": "Security",
            "description": "Implementing BeyondCorp principles and Identity-Aware Proxy for secure application access.",
            "startTime": "01:00 PM",
            "endTime": "01:45 PM",
            "ryzenWalkTime": "01:30 PM"
        },
        {
            "id": "T006",
            "title": "Modern BI with Looker & Looker Studio",
            "speakers": [
                {"firstName": "Chris", "lastName": "Evans", "linkedin": "https://linkedin.com/in/chrisevans"},
                {"firstName": "Maya", "lastName": "Patel", "linkedin": "https://linkedin.com/in/mayapatel"}
            ],
            "category": "Data & Analytics",
            "description": "Transforming data into actionable insights using Looker's semantic layer and visualization tools.",
            "startTime": "01:45 PM",
            "endTime": "02:30 PM",
            "ryzenWalkTime": "02:15 PM"
        },
        {
            "id": "T007",
            "title": "Globally Distributed Databases with Spanner",
            "speakers": [
                {"firstName": "Tom", "lastName": "Hanks", "linkedin": "https://linkedin.com/in/tomhanks"}
            ],
            "category": "Databases",
            "description": "Understanding strong consistency and horizontal scale with Google Cloud Spanner.",
            "startTime": "02:30 PM",
            "endTime": "03:15 PM",
            "ryzenWalkTime": "03:00 PM"
        },
        {
            "id": "T008",
            "title": "Edge Networking and Cloud Armor",
            "speakers": [
                {"firstName": "Linda", "lastName": "Park", "linkedin": "https://linkedin.com/in/lindapark"}
            ],
            "category": "Infrastructure",
            "description": "Protecting your applications from DDoS attacks and optimizing latency with Google's global network.",
            "startTime": "03:15 PM",
            "endTime": "04:00 PM",
            "ryzenWalkTime": "03:45 PM"
        }
    ]
}

@app.route('/')
def index():
    return render_template('index.html', conference=CONFERENCE_DATA)

@app.route('/api/talks')
def get_talks():
    return jsonify(CONFERENCE_DATA['talks'])

if __name__ == '__main__':
    app.run(debug=True, port=5001)
