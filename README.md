# 🌍 Caspian Elegance — Tourism Platform

A Django web application for exploring Azerbaijan: travel destinations, cities, and UNESCO heritage sites, with a custom admin panel, Google OAuth login, and an AJAX-powered favourites system.

![Python](https://img.shields.io/badge/Python-3.11-blue)
![Django](https://img.shields.io/badge/Django-5.x-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 📸 Screenshots
<table>
  <tr>
    <th>Home Page</th>
    <th>Plan Your Trip</th>
    <th>Favourites</th>
  </tr>
  <tr>
    <td width="33%">
      <video src="https://github.com/user-attachments/assets/42bd139f-6cc7-4f15-b10e-a638e003e353" width="100%" controls muted loop></video>
    </td>
    <td width="33%">
      <video src="https://github.com/user-attachments/assets/6a524fef-3aea-4907-882a-20085db0c2b3" width="100%" controls muted loop></video>
    </td>
    <td width="33%">
      <video src="https://github.com/user-attachments/assets/dcf56f0d-665f-4299-9353-dcde4f68c88c" width="100%" controls muted loop></video>
    </td>
  </tr>
</table>

## ⚙️ Tech Stack

- **Backend:** Python 3.11, Django
- **Database:** SQLite (dev) / PostgreSQL (prod)
- **Auth:** django-allauth (email/password + Google OAuth2), session persistence
- **Frontend:** HTML, CSS, JavaScript (Fetch API for AJAX interactions)
- **Admin:** Customized Django Admin for content management

## 🚀 Features

- 🗺️ Catalog of Azerbaijan travel destinations, cities, and UNESCO heritage sites
- 🧭 Trip-planning content pages
- 🛠️ Customized admin panel for managing all dynamic content
- 🖼️ Image uploads with instance-based (per-object) file paths
- 🔗 Relational models (Destination, City, Site) linked via Django ORM ForeignKeys
- ⚡ Query optimization using `select_related` and `prefetch_related`
- 🗑️ Soft-delete pattern via an `is_active` flag instead of hard deletes
- 🔐 Authentication via email/password and Google OAuth2 (django-allauth)
- ❤️ Favourites system built with the Fetch API, state persisted in the database

## 🛠️ Installation

```bash
# 1. Clone the repo
git clone https://github.com/rasim-baghirov/caspian-elegance.git
cd caspian-elegance

# 2. Create virtual environment
python -m venv venv
venv\Scripts\activate      # Windows
source venv/bin/activate   # Mac/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Setup environment variables
cp .env.example .env
# fill in your .env file

# 5. Run migrations
python manage.py migrate

# 6. Create superuser
python manage.py createsuperuser

# 7. Run the server
python manage.py runserver
```

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 📁 Project Structure

```text
caspian-elegance/
├── config/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── tourism/
│   ├── migrations/
│   ├── templatetags/
│   │   └── tourism_extras.py
│   ├── static/
│   │   └── blog/
│   │       ├── css/
│   │       ├── images/
│   │       └── js/
│   ├── templates/
│   │   └── blog/
│   │       ├── index.html
│   │       ├── favourites.html
│   │       ├── plan_your_trip.html
│   │       └── profile.html
│   ├── admin.py
│   ├── apps.py
│   ├── forms.py
│   ├── models.py
│   ├── tests.py
│   ├── urls.py
│   └── views.py
│
├── templates/
│   ├── account/
│   │   ├── login.html
│   │   ├── logout.html
│   │   └── signup.html
│   ├── base.html
│   └── footer.html
│
├── static/
│   ├── bootstrap/
│   ├── bootstrap-icons/
│   ├── css/
│   ├── fontawesome/
│   ├── fonts/
│   ├── images/
│   └── js/
│
├── media/
│   ├── attractions/
│   ├── carousel/
│   └── tours/
│
├── .gitignore
├── manage.py
└── requirements.txt
```

## 👤 Author

**Rasim Baghirov**
- GitHub: [@rasim-baghirov](https://github.com/rasim-baghirov)
- LinkedIn: [rasim-baghirov](https://www.linkedin.com/in/rasim-baghirov/)
- Telegram: [@klashraik](https://t.me/klashraik)
- Email: rasimba05@gmail.com
