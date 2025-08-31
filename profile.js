document.addEventListener("DOMContentLoaded", () => {
  const profileForm = document.getElementById("profile-form");
  const usernameInput = document.getElementById("username");
  const educationInput = document.getElementById("education");
  const bioInput = document.getElementById("bio");
  const roleInput = document.getElementById("role");

  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const userRef = db.collection("users").doc(user.uid);
      const userSnap = await userRef.get();
      if (userSnap.exists) {
        const userData = userSnap.data();
        usernameInput.value = userData.username;
        educationInput.value = userData.education;
        bioInput.value = userData.bio;
        roleInput.value = userData.role;
      }

      if (profileForm) {
        profileForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          const newUsername = usernameInput.value;
          const newEducation = educationInput.value;
          const newBio = bioInput.value;
          await userRef.update({
            username: newUsername,
            education: newEducation,
            bio: newBio,
          });
          alert("Profile updated successfully!");
        });
      }
    } else {
      window.location.href = "login.html";
    }
  });
});
