// ---------- REGISTRATION ----------
const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = registerForm.username.value;
    const email = registerForm.email.value;
    const password = registerForm.password.value;
    const confirmPassword = registerForm.confirm_password.value;
    const role = registerForm.role.value;

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
      const userData = {
        email: user.email,
        username: username,
        role: role,
        education: "",
        bio: "",
      };
      await db.collection("users").doc(user.uid).set(userData);
      alert("Registration successful! Redirecting to your dashboard.");
      console.log("Redirecting to:", `${role}.html`);
      window.location.href = `${role}.html`;
    } catch (error) {
      alert(error.message);
    }
  });
}

// ---------- LOGIN ----------
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;
    try {
      const userCredential = await auth.signInWithEmailAndPassword(
        email,
        password
      );
      const user = userCredential.user;
      const userRef = db.collection("users").doc(user.uid);
      const userSnap = await userRef.get();
      if (userSnap.exists) {
        const userData = userSnap.data();
        window.location.href = `${userData.role}.html`;
      } else {
        alert("User data not found. Please contact support.");
      }
    } catch (error) {
      alert(error.message);
    }
  });
}
