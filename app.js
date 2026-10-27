console.log("Hello World!");
// variables
const name = "Jairo Lucio Camargo";
let hasDownloadedResume = false;
let projectEndDate = "2026-11-30";
let downloadCount = 0;
const navigationItems = [
    { label: "Skills", target: "#skills" },
    { label: "Projects", target: "#projects" },
    { label: "Experience & Education", target: "#experience" }
];
const projects = [
    {
        title: "The Manor",
        description: "First game project: a simple text-based horror game.",
        deadline: "2025-10-25",
        imageURL: "./Images/The_Manor_Title.png"
    },
    {
        title: "Castle Robber",
        description: "Platformer with two platforming layers that need to be managed.",
        deadline: "2025-12-04",
        imageURL: "./Images/Castle_Robber_Opening.png"
    },
    {
        title: "Project Fireplace",
        description: "Future game project: an RPG with grid-based combat.",
        deadline: "2026-11-30",
        imageURL: ""
    }
];
const workExperience = [
    {
        role: "Intern",
        organization: "ViperInk.",
        startDate: "2024",
        endDate: "2025"
    }
];

const education = [
    {
        role: "Undergraduate Student",
        organization: "Northern Arizona University",
        startDate: "2025",
        endDate: "Present"
    }
];
const skills = [];

// functions
function renderNavigation() 
{
    const $menu = $("#navigationMenu");
    $menu.empty();
    navigationItems.forEach(function (item) {
        const $link = $("<a>")
            .addClass("nav-link")
            .attr("href", item.target)
            .text(item.label);

        const $listItem = $("<li>")
            .addClass("nav-item")
            .append($link);

        $menu.append($listItem);
    });
}

function enableSmoothScrolling() 
{
    $("#navigationMenu")
        .off("click", "a")
        .on("click", "a", function (event) {
            const target = $(this).attr("href");
            const $target = $(target);
            if (target && $target.length) {
                event.preventDefault();
                $("html, body").stop().animate({
                    scrollTop: $target.offset().top - 75
                }, 500);
                const $navbar = $("#navbarNav");
                if (
                    $navbar.length &&
                    $navbar.hasClass("show") &&
                    typeof $navbar.collapse === "function"
                ) {
                    $navbar.collapse("hide");
                }
            }
        });
}
function showGreeting(personName) 
{
    return "Hello, my name is " + personName +
        "! Welcome to my portfolio!";
}

function downloadAlert() 
{
    if (!hasDownloadedResume) 
    {
        alert("Your resume is downloaded successfully!");
        hasDownloadedResume = true;
    }
    downloadCount++;
    $("#downloadCount").text(downloadCount);
}

function validateSkill(skill, callback, ignoredIndex = -1) {
    const cleanedSkill = skill.trim();
    if (cleanedSkill === "") 
    {
        callback(false, "Please enter a skill.");
        return;
    }
    const duplicate = skills.some(function (existingSkill, index) {
        return index !== ignoredIndex &&
            existingSkill.toLowerCase() === cleanedSkill.toLowerCase();
    });
    if (duplicate) 
    {
        callback(false, "That skill already exists.");
        return;
    }
    callback(true, "");
}

function addSkillToArray(skill, callback) {
    validateSkill(skill, function (isValid, message) {
        if (!isValid) 
        {
            $("#skillError").text(message);
            $("#name").trigger("focus");
            return;
        }
        const cleanedSkill = skill.trim();
        skills.push(cleanedSkill);
        if (typeof callback === "function") 
        {
            callback(cleanedSkill);
        }
    });
}

function editSkill(index, newName, callback) {
    if (index < 0 || index >= skills.length) 
    {
        return;
    }
    validateSkill(newName, function (isValid, message) {
        if (!isValid) 
        {
            $("#skillError").text(message);
            return;
        }
        skills[index] = newName.trim();
        if (typeof callback === "function") 
        {
            callback(index, skills[index]);
        }
    }, index);
}

function removeSkill(index, callback) {
    if (index < 0 || index >= skills.length) 
    {
        return;
    }

    const removedSkill = skills.splice(index, 1)[0];

    if (typeof callback === "function") 
    {
        callback(removedSkill);
    }
}

function renderSkills() {
    const $list = $("#additionalSkills");
    const $emptyMessage = $("#emptySkillsMessage");
    $list.empty();
    if (skills.length === 0) 
    {
        $emptyMessage.stop(true, true).fadeIn(200);
        return;
    }
    $emptyMessage.hide();
    skills.forEach(function (skill, index) {
        const $item = $("<li>")
            .addClass(
                "d-flex align-items-center justify-content-between " +
                "gap-2 py-2 border-bottom"
            )
            .attr("data-index", index);
        const $skillName = $("<button>")
            .attr("type", "button")
            .addClass("btn btn-link text-start text-dark p-0 skill-edit")
            .text(skill)
            .attr("aria-label", "Edit skill: " + skill)
            .on("click", function () {
                startEditingSkill(index);
            });
        const $deleteButton = $("<button>")
            .attr("type", "button")
            .addClass("btn btn-sm btn-outline-danger")
            .text("Delete")
            .attr("aria-label", "Delete skill: " + skill)
            .on("click", function () {
                // Animate the selected item before removing it.
                $item.stop(true, true).slideUp(200, function () {
                    removeSkill(index, function () {
                        renderSkills();
                    });
                });
            });
        $item.append($skillName, $deleteButton);
        $list.append($item);
        $item.hide().fadeIn(250);
    });
}

function startEditingSkill(index) {
    const $item = $("#additionalSkills li").filter(function () {
        return Number($(this).attr("data-index")) === index;
    });
    if (!$item.length) 
    {
        return;
    }
    const originalSkill = skills[index];
    const $input = $("<input>")
        .attr({
            type: "text",
            "aria-label": "Edit skill name"
        })
        .addClass("form-control form-control-sm")
        .val(originalSkill);
    const $saveButton = $("<button>")
        .attr("type", "button")
        .addClass("btn btn-sm btn-success")
        .text("Save");
    const $cancelButton = $("<button>")
        .attr("type", "button")
        .addClass("btn btn-sm btn-secondary")
        .text("Cancel");
    $item.empty().append(
        $input,
        $saveButton,
        $cancelButton
    );
    $saveButton.on("click", function () {
        const newName = $input.val();

        editSkill(index, newName, function () {
            $("#skillError").text("");
            renderSkills();
        });
    });
    $cancelButton.on("click", function () {
        $("#skillError").text("");
        renderSkills();
    });
    $input.on("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            $saveButton.trigger("click");
        } else if (event.key === "Escape") {
            event.preventDefault();
            $("#skillError").text("");
            renderSkills();
        }
    });
    $input.trigger("focus").trigger("select");
}

function addSkill(event) {
    event.preventDefault();
    const $input = $("#name");
    const skill = $input.val();
    $("#skillError").text("");
    addSkillToArray(skill, function () {
        renderSkills();
        $("#form_Skill")[0].reset();
        $("#skillError").text("");
        $input.trigger("focus");
    });
}

function keyboardCommands() {
    $("#name")
        .off("keydown.skillShortcuts")
        .on("keydown.skillShortcuts", function (event) {
            if (event.key === "Enter") 
            {
                event.preventDefault();
                $("#form_Skill").trigger("submit");
            }

            if (event.key === "Escape") 
            {
                event.preventDefault();
                $("#form_Skill")[0].reset();
                $("#skillError").text("");
                $(this).trigger("focus");
            }
        });
}

function daysUntilDeadline(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(date + "T00:00:00");
    return Math.ceil(
        (deadline.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24)
    );
}

function projectStatusCheck(date) {
    const difference = daysUntilDeadline(date);
    if (difference > 0) 
    {
        return "Ongoing";
    }
    if (difference < 0) 
    {
        return "Completed";
    }
    return "Ongoing (due today)";
}

function displayProjects() {
    const $projectList = $("#projectList");
    $projectList.empty();
    for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        const $column = $("<div>")
            .addClass("col-md-6 col-lg-4");
        const $card = $("<div>")
            .addClass("card h-100 border-0 shadow-sm");
        if (project.imageURL) 
        {
            const $image = $("<img>")
                .attr({
                    src: project.imageURL,
                    alt: project.title + " project image"
                })
                .addClass("card-img-top")
                .css({
                    height: "200px",
                    objectFit: "cover"
                });

            $card.append($image);
        }
        const $body = $("<div>").addClass("card-body");
        const $title = $("<h5>")
            .addClass("card-title")
            .text(project.title);
        const $description = $("<p>")
            .addClass("card-text")
            .text(project.description);
        const $deadline = $("<p>")
            .addClass("card-text")
            .text("Deadline: " + project.deadline);
        const $status = $("<p>")
            .addClass("card-text fw-bold")
            .text("Status: " + projectStatusCheck(project.deadline));
        $body.append($title, $description, $deadline, $status);
        $card.append($body);
        $column.append($card);
        $projectList.append($column);
        $column.hide().fadeIn(250);
    }
}

function sortProjects(order) {
    projects.sort(function (a, b) {
        const dateA = new Date(a.deadline + "T00:00:00");
        const dateB = new Date(b.deadline + "T00:00:00");
        return order === "descending"
            ? dateB - dateA
            : dateA - dateB;
    });
    displayProjects();
}

function createTable(containerId, entries) {
    const $container = $("#" + containerId);
    const $table = $("<table>")
        .addClass("table table-striped table-hover align-middle mb-0");
    const headers = [
        "Role",
        "Company / School",
        "Start Date",
        "End Date"
    ];
    const $thead = $("<thead>").addClass("table-dark");
    const $headerRow = $("<tr>");
    headers.forEach(function (header) {
        $headerRow.append(
            $("<th>").attr("scope", "col").text(header)
        );
    });
    $thead.append($headerRow);
    $table.append($thead);
    const $tbody = $("<tbody>");
    entries.forEach(function (entry) {
        const $row = $("<tr>");
        const values = [
            entry.role,
            entry.organization,
            entry.startDate,
            entry.endDate
        ];
        values.forEach(function (value, index) {
            const $cell = $("<td>").text(value);
            if (index === 0) 
            {
                $cell.addClass("fw-bold");
            }
            $row.append($cell);
        });
        $tbody.append($row);
    });
    $table.append($tbody);
    $container.empty().append($table);
}

// startup
$(document).ready(function () {
    $("#greeting").text(showGreeting(name));
    $("#form_Skill").on("submit", addSkill);
    keyboardCommands();
    renderSkills();
    renderNavigation();
    enableSmoothScrolling();
    displayProjects();
    $("#projectSort").on("change", function () {
        sortProjects($(this).val());
    });
    $("#timer").text(daysUntilDeadline(projectEndDate));
    $("#resumeDownload").on("click", downloadAlert);
    createTable("experienceTable", workExperience);
    createTable("educationTable", education);
});

