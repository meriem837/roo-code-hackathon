document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const registerBtn = document.getElementById("register-btn");
  const getStartedBtn = document.getElementById("get-started-btn");
  const userAvatar = document.getElementById("user-avatar");
  const userDropdown = document.getElementById("user-dropdown");

  if (loginBtn) {
    const handleRoleSelection = (action) => {
      let role = "";
      while (role !== "teacher" && role !== "student") {
        role = prompt("Are you a 'teacher' or a 'student'?").toLowerCase();
        if (role !== "teacher" && role !== "student") {
          alert(
            "This question is important. Please answer with 'teacher' or 'student'."
          );
        }
      }
      window.location.href = `${role}-${action}.html`;
    };

    loginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      handleRoleSelection("login");
    });

    registerBtn.addEventListener("click", (e) => {
      e.preventDefault();
      handleRoleSelection("register");
    });

    getStartedBtn.addEventListener("click", (e) => {
      e.preventDefault();
      handleRoleSelection("register");
    });
  }

  if (userAvatar) {
    userAvatar.addEventListener("click", () => {
      userDropdown.style.display =
        userDropdown.style.display === "block" ? "none" : "block";
    });

    window.addEventListener("click", (e) => {
      if (!userAvatar.contains(e.target)) {
        userDropdown.style.display = "none";
      }
    });
  }
});
