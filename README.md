# 🏃 Jog Tracker

![GitHub repo size](https://img.shields.io/github/repo-size/yourusername/jog-tracker)
![GitHub contributors](https://img.shields.io/github/contributors/yourusername/jog-tracker)
![GitHub stars](https://img.shields.io/github/stars/yourusername/jog-tracker?style=social)
![GitHub license](https://img.shields.io/github/license/yourusername/jog-tracker)

🚀 **Jog Tracker** is a web application that helps users track their running distance, time, and average speed. Built with **React, Firebase, Redux, and React Router**, it allows users to log runs, view their stats, and manage their running history.

## 📌 Features
- 🏃 **Log Running Sessions**: Track distance, time, and speed.
- 🔢 **Automatic Speed Calculation**: Distance/time conversion to km/h.
- 🛡️ **Authentication**: Register/login via Email & Google Authentication.
- 📊 **Personalized Profile**: View total distance and average speed.
- 🗂️ **State Management with Redux**: Efficient handling of running logs.
- ☁️ **Firebase Firestore Database**: Persistent data storage.
- 🔄 **Live Updates**: Runs sync in real-time.
- 🎨 **Responsive UI**: Optimized for mobile and desktop.

---

## 🛠️ Tech Stack

### 🔹 Frontend
![React](https://img.shields.io/badge/React-18-blue?logo=react&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-6-red?logo=reactrouter&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-Toolkit-purple?logo=redux&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-blue?logo=tailwindcss&logoColor=white)

### 🔹 Backend & Database
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%7C%20Firestore-orange?logo=firebase&logoColor=white)

### 🔹 Development Tools
![Vite](https://img.shields.io/badge/Vite-4-blueviolet?logo=vite&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-Code_Quality-purple?logo=eslint&logoColor=white)

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** >= 14
- **Firebase Account**

### 🔧 Steps
1. **Clone the Repository**
   ```sh
   git clone https://github.com/yourusername/jog-tracker.git
   cd jog-tracker
   ```

2. **Install Dependencies**
   ```sh
   npm install
   ```

3. **Setup Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Enable **Authentication** (Email/Google) & **Firestore Database**.
   - Add Firebase config to `.env`:
     ```sh
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

4. **Run the Development Server**
   ```sh
   npm run dev
   ```

5. **Open the App**
   - Navigate to `http://localhost:5173`

---

## 📸 Screenshots
(You can add images showcasing the UI here)

---

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing
Pull requests are welcome! If you'd like to contribute, please fork the repo and submit a PR.

1. **Fork the Project**
2. **Create a Feature Branch (`git checkout -b feature-branch`)**
3. **Commit Changes (`git commit -m 'Add new feature'`)**
4. **Push to Branch (`git push origin feature-branch`)**
5. **Open a Pull Request**

---

## ⭐ Acknowledgments
- Built with ❤️ using **React, Redux, Firebase, and Tailwind CSS**
- Inspired by fitness tracking applications

---

### 🔗 Connect with Me
- [GitHub](https://github.com/yourusername)
- [LinkedIn](https://www.linkedin.com/in/yourprofile)

