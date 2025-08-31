document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.querySelector(".login-btn");
  const registerBtn = document.querySelector(".register-btn");
  const userProfile = document.querySelector(".user-profile");
  const searchContainer = document.querySelector(".search-container");
  const userAvatar = document.getElementById("user-avatar");
  const userDropdown = document.getElementById("user-dropdown");
  const profileLink = document.getElementById("profile-link");
  const logoutBtn = document.getElementById("logout-btn");

  auth.onAuthStateChanged(async (user) => {
    if (user) {
      // User is signed in
      if (loginBtn) loginBtn.style.display = "none";
      if (registerBtn) registerBtn.style.display = "none";
      if (userProfile) userProfile.style.display = "block";
      if (searchContainer) searchContainer.style.display = "flex";

      const userRef = db.collection("users").doc(user.uid);
      const userSnap = await userRef.get();
      if (userSnap.exists) {
        const userData = userSnap.data();
        if (userData.photoURL) {
          userAvatar.style.backgroundImage = `url(${userData.photoURL})`;
          userAvatar.classList.add("user-avatar-image");
        } else {
          userAvatar.textContent = user.email.charAt(0).toUpperCase();
        }
        if (profileLink) {
          profileLink.href = `${userData.role}-profile.html`;
        }
      }

      if (userAvatar) {
        userAvatar.addEventListener("click", () => {
          userDropdown.style.display =
            userDropdown.style.display === "block" ? "none" : "block";
        });
      }

      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          auth.signOut().then(() => {
            window.location.href = "index.html";
          });
        });
      }
    } else {
      // User is signed out
      if (loginBtn) loginBtn.style.display = "block";
      if (registerBtn) registerBtn.style.display = "block";
      if (userProfile) userProfile.style.display = "none";
      if (searchContainer) searchContainer.style.display = "none";
    }
  });

  window.addEventListener("click", (e) => {
    if (userDropdown && userAvatar && !userAvatar.contains(e.target)) {
      userDropdown.style.display = "none";
    }
  });

  const searchIcon = document.querySelector(".search-btn");
  const searchInput = document.querySelector(".search-container input");
  const mainContent = document.querySelector("main");
  const searchResults = document.getElementById("search-results");
  const filterContainer = document.querySelector(".filter-container");
  const subjectFilter = filterContainer
    ? filterContainer.querySelector('input[placeholder="Filter by Subject"]')
    : null;
  const gradeFilter = filterContainer
    ? filterContainer.querySelector('input[placeholder="Filter by Grade"]')
    : null;

  const courses = [
    {
      title: "Introduction to Algebra",
      subject: "Math",
      grade: "9",
    },
    {
      title: "Advanced Physics",
      subject: "Science",
      grade: "12",
    },
    {
      title: "History of Morocco",
      subject: "History",
      grade: "10",
    },
    {
      title: "French Literature",
      subject: "Languages",
      grade: "11",
    },
    {
      title: "Data Structures in Python",
      subject: "Computer Science",
      grade: "12",
    },
  ];

  function displayCourses(filteredCourses) {
    searchResults.innerHTML = ""; // Clear previous results
    if (filteredCourses.length === 0) {
      searchResults.innerHTML = "<p>No courses match your criteria.</p>";
    } else {
      const courseBoxes = filteredCourses
        .map(
          (course) => `
        <div class="course-box">
          <h4>${course.title}</h4>
          <p>Subject: ${course.subject}</p>
          <p>Grade: ${course.grade}</p>
        </div>
      `
        )
        .join("");
      searchResults.innerHTML = `<div class="course-boxes">${courseBoxes}</div>`;
    }
  }

  if (searchIcon) {
    searchIcon.addEventListener("click", () => {
      const searchTerm = searchInput.value.toLowerCase();
      const subjectTerm = subjectFilter
        ? subjectFilter.value.toLowerCase()
        : "";
      const gradeTerm = gradeFilter ? gradeFilter.value.toLowerCase() : "";

      const filteredCourses = courses.filter((course) => {
        const titleMatch = course.title.toLowerCase().includes(searchTerm);
        const subjectMatch =
          !subjectTerm || course.subject.toLowerCase().includes(subjectTerm);
        const gradeMatch =
          !gradeTerm || course.grade.toLowerCase().includes(gradeTerm);
        return titleMatch && subjectMatch && gradeMatch;
        const yourCoursesLink = document.getElementById("your-courses-link");
        if (yourCoursesLink) {
          yourCoursesLink.addEventListener("click", (e) => {
            const mainContent = document.querySelector("main");
            const searchResults = document.getElementById("search-results");
            const filterContainer = document.querySelector(".filter-container");
            const trendingCourses = document.querySelector(".trending-courses");
            const imageDescriptionSection = document.querySelector(
              ".image-description-section"
            );

            if (mainContent) mainContent.style.display = "flex";
            if (searchResults) searchResults.style.display = "none";
            if (filterContainer) filterContainer.style.display = "none";
            if (trendingCourses) trendingCourses.style.display = "block";
            if (imageDescriptionSection)
              imageDescriptionSection.style.display = "flex";
          });
        }
      });

      if (mainContent) mainContent.style.display = "none";
      if (searchResults) searchResults.style.display = "block";
      if (filterContainer) filterContainer.style.display = "flex";

      const trendingCourses = document.querySelector(".trending-courses");
      if (trendingCourses) trendingCourses.style.display = "none";
      const imageDescriptionSection = document.querySelector(
        ".image-description-section"
      );
      if (imageDescriptionSection)
        imageDescriptionSection.style.display = "none";

      displayCourses(filteredCourses);
    });
  }
});
