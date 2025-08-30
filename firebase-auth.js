// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDo5nHeFMmA4rXTGwGq_PM02Tk386cx_1E",
  authDomain: "roo-code-hackathon.firebaseapp.com",
  projectId: "roo-code-hackathon",
  storageBucket: "roo-code-hackathon.firebasestorage.app",
  messagingSenderId: "537082680130",
  appId: "1:537082680130:web:6c996e34233bddc9f92edb",
  measurementId: "G-XDLSLHRTWM",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ---------- TEACHER REGISTRATION ----------
const teacherRegisterForm = document.getElementById("teacher-register-form");
if (teacherRegisterForm) {
  teacherRegisterForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = teacherRegisterForm.email.value;
    const password = teacherRegisterForm.password.value;
    const confirmPassword = teacherRegisterForm.confirm_password.value;

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      const user = userCredential.user;
      const userData = { email: user.email, role: "teacher" };
      await db.collection("users").doc(user.uid).set(userData);
      alert("Registration successful! Redirecting to your dashboard.");
      window.location.href = "teacher.html";
    } catch (error) {
      alert(error.message);
    }
  });
}

// ---------- STUDENT REGISTRATION ----------
const studentRegisterForm = document.getElementById("student-register-form");
if (studentRegisterForm) {
  studentRegisterForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("student-email-register").value;
    const grade = document.getElementById("student-grade-register").value;
    const subjects = document.getElementById("student-subjects-register").value;

    try {
      const tempPassword = Math.random().toString(36).slice(-8);
      const userCredential = await auth.createUserWithEmailAndPassword(
        email,
        tempPassword
      );
      const user = userCredential.user;
      const userData = {
        email: user.email,
        role: "student",
        grade: grade,
        subjects: subjects,
      };
      await db.collection("users").doc(user.uid).set(userData);

      const actionCodeSettings = {
        url: window.location.origin + "/student.html",
        handleCodeInApp: true,
      };
      await auth.sendSignInLinkToEmail(email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);

      alert(
        "Registration successful! Please check your email for a login link."
      );
      window.location.href = "index.html";
    } catch (error) {
      alert(error.message);
    }
  });
}

// ---------- TEACHER LOGIN ----------
const teacherLoginForm = document.getElementById("teacher-login-form");
if (teacherLoginForm) {
  teacherLoginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = teacherLoginForm.email.value;
    const password = teacherLoginForm.password.value;
    try {
      await auth.signInWithEmailAndPassword(email, password);
      window.location.href = "teacher.html";
    } catch (error) {
      alert(error.message);
    }
  });
}

// ---------- STUDENT LOGIN (via link) ----------
if (auth.isSignInWithEmailLink(window.location.href)) {
  let email = window.localStorage.getItem("emailForSignIn");
  if (!email) {
    email = window.prompt("Please provide your email for confirmation");
  }
  auth
    .signInWithEmailLink(email, window.location.href)
    .then(async (result) => {
      window.localStorage.removeItem("emailForSignIn");
      const user = result.user;
      const userRef = db.collection("users").doc(user.uid);
      const userSnap = await userRef.get();
      if (userSnap.exists() && userSnap.data().role === "student") {
        window.location.href = "student.html";
      } else {
        window.location.href = "index.html";
      }
    })
    .catch((error) => {
      alert(error.message);
    });
}

// ---------- LOGOUT ----------
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    auth
      .signOut()
      .then(() => {
        window.location.href = "index.html";
      })
      .catch((error) => {
        alert(error.message);
      });
  });
}

// ---------- PROFILE PAGE LOGIC ----------
const teacherProfileForm = document.getElementById("teacher-profile-form");
if (teacherProfileForm) {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const userRef = db.collection("users").doc(user.uid);
      const userSnap = await userRef.get();
      if (userSnap.exists) {
        const userData = userSnap.data();
        teacherProfileForm.username.value = userData.username || "";
        teacherProfileForm.expertise.value = userData.expertise || "";
        teacherProfileForm.education.value = userData.education || "";
        teacherProfileForm.experience.value = userData.experience || "";
      }
    }
  });

  teacherProfileForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      const userRef = db.collection("users").doc(user.uid);
      await userRef.update({
        username: teacherProfileForm.username.value,
        expertise: teacherProfileForm.expertise.value,
        education: teacherProfileForm.education.value,
        experience: teacherProfileForm.experience.value,
      });
      alert("Profile updated successfully!");
    }
  });
}

const studentProfileForm = document.getElementById("student-profile-form");
if (studentProfileForm) {
  const profilePic = document.getElementById("profile-pic");
  const photoUpload = document.getElementById("photo-upload");

  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const userRef = db.collection("users").doc(user.uid);
      const userSnap = await userRef.get();
      if (userSnap.exists) {
        const userData = userSnap.data();
        studentProfileForm.username.value = userData.username || "";
        studentProfileForm.grade.value = userData.grade || "";
        studentProfileForm.subjects.value = userData.subjects || "";
        studentProfileForm.bio.value = userData.bio || "";
        if (userData.photoURL) {
          profilePic.src = userData.photoURL;
        }
      }
    }
  });

  studentProfileForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      const userRef = db.collection("users").doc(user.uid);
      await userRef.update({
        username: studentProfileForm.username.value,
        grade: studentProfileForm.grade.value,
        subjects: studentProfileForm.subjects.value,
        bio: studentProfileForm.bio.value,
      });

      const file = photoUpload.files[0];
      if (file) {
        const storageRef = firebase.storage().ref();
        const photoRef = storageRef.child(`profile-pictures/${user.uid}`);
        await photoRef.put(file);
        const photoURL = await photoRef.getDownloadURL();
        await userRef.update({ photoURL });
        profilePic.src = photoURL;
      }

      alert("Profile updated successfully!");
    }
  });
}
