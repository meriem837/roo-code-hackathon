document.addEventListener("DOMContentLoaded", () => {
  const courseBoxesContainer = document.querySelector(
    "#courses-section .course-boxes"
  );

  const loadCourses = async (user) => {
    if (!courseBoxesContainer) return;

    // Clear existing courses except for the "Add Course" button
    courseBoxesContainer.innerHTML = `
      <a href="add-course.html" class="course-box add-course-box">
        <span>+</span>
        <p>Add Course</p>
      </a>
    `;

    const coursesQuery = await db
      .collection("courses")
      .where("teacherId", "==", user.uid)
      .orderBy("createdAt", "desc")
      .get();

    coursesQuery.forEach((doc) => {
      const course = doc.data();
      const courseElement = document.createElement("div");
      courseElement.classList.add("course-box");
      courseElement.style.backgroundImage = `url(${course.imageUrl})`;
      courseElement.style.backgroundSize = "cover";
      courseElement.style.backgroundPosition = "center";

      const courseTitle = document.createElement("h4");
      courseTitle.textContent = course.title;
      courseTitle.style.backgroundColor = "rgba(0,0,0,0.5)";
      courseTitle.style.color = "white";
      courseTitle.style.padding = "10px";
      courseTitle.style.textAlign = "center";

      courseElement.appendChild(courseTitle);

      // Insert the new course before the "Add Course" button
      courseBoxesContainer.insertBefore(
        courseElement,
        courseBoxesContainer.lastChild
      );
    });
  };

  auth.onAuthStateChanged((user) => {
    if (user) {
      loadCourses(user);
    }
  });
});
