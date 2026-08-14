/* ======================================
   BUGFLOW - ISSUE MANAGEMENT SYSTEM
====================================== */


"use strict";


// ===============================
// STORAGE
// ===============================

const STORAGE_KEY = "bugflow_issues";


let bugs =
    JSON.parse(
        localStorage.getItem(STORAGE_KEY)
    ) || [];




// ===============================
// DOM ELEMENTS
// ===============================


const titleInput =
    document.getElementById("bugTitle");


const descriptionInput =
    document.getElementById("bugDescription");


const priorityInput =
    document.getElementById("priority");


const categoryInput =
    document.getElementById("category");


const assigneeInput =
    document.getElementById("assignee");


const createButton =
    document.querySelector(".submit-btn");



const columns =
    document.querySelectorAll(".column");





// ===============================
// CREATE BUG
// ===============================


createButton.addEventListener(
    "click",
    createBug
);



function createBug(){


    const title =
        titleInput.value.trim();



    const description =
        descriptionInput.value.trim();



    if(!title || !description){

        alert(
            "Please enter bug title and description"
        );

        return;

    }



    const bug = {


        id:
        Date.now(),


        title,


        description,


        priority:
        priorityInput.value,


        category:
        categoryInput.value,


        assignee:
        assigneeInput.value,


        status:
        "Backlog",


        created:
        new Date()
        .toLocaleDateString()


    };



    bugs.push(
        bug
    );



    saveBugs();


    renderBugs();


    updateStats();



    clearForm();



}







// ===============================
// SAVE DATA
// ===============================


function saveBugs(){

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
            bugs
        )
    );

}







// ===============================
// RENDER BUGS
// ===============================


function renderBugs(){


    columns.forEach(
        column=>{

            const cards =
            column.querySelectorAll(
                ".bug-card"
            );


            cards.forEach(
                card=>card.remove()
            );


        }
    );



    bugs.forEach(
        bug=>{


            const card =
            document.createElement(
                "div"
            );


            card.className =
                "bug-card";



            card.innerHTML = `


                <span class="priority ${bug.priority.toLowerCase()}">

                    ${bug.priority}

                </span>



                <h4>
                    ${bug.title}
                </h4>



                <p>
                    ${bug.description}
                </p>



                <small>
                    ${bug.category}
                </small>


                <footer>

                    #${bug.id}

                    <br>

                    👤 ${bug.assignee}

                    <br>

                    <button onclick="deleteBug(${bug.id})">

                    Delete

                    </button>

                </footer>

            `;




            const column =
            getColumn(
                bug.status
            );



            column.appendChild(
                card
            );


        }
    );


}






// ===============================
// COLUMN FINDER
// ===============================


function getColumn(status){


    const headings = {

        Backlog:0,

        Todo:1,

        "In Progress":2,

        Done:3

    };



    return columns[
        headings[status]
    ];


}






// ===============================
// DELETE BUG
// ===============================


function deleteBug(id){


    bugs =
    bugs.filter(
        bug =>
        bug.id !== id
    );



    saveBugs();


    renderBugs();


    updateStats();


}






// ===============================
// UPDATE DASHBOARD
// ===============================


function updateStats(){


    const cards =
    document.querySelectorAll(
        ".stat-card h2"
    );



    const total =
    bugs.length;



    const open =
    bugs.filter(
        b =>
        b.status !== "Done"
    )
    .length;



    const progress =
    bugs.filter(
        b =>
        b.status === "In Progress"
    )
    .length;



    const done =
    bugs.filter(
        b =>
        b.status === "Done"
    )
    .length;



    if(cards.length){


        cards[0].innerText =
        total;


        cards[1].innerText =
        open;


        cards[2].innerText =
        progress;


        cards[3].innerText =
        done;


    }


}






// ===============================
// CLEAR FORM
// ===============================


function clearForm(){


    titleInput.value="";

    descriptionInput.value="";

    priorityInput.value="Critical";

    categoryInput.value="Frontend";

}







// ===============================
// DEMO BUGS
// ===============================


function loadDemo(){


    if(bugs.length)
        return;



    bugs=[


        {

            id:101,

            title:
            "Image loading issue",

            description:
            "Images are slow on homepage",

            priority:
            "Low",

            category:
            "Performance",

            assignee:
            "Dev Master",

            status:
            "Done"

        },



        {

            id:102,

            title:
            "Checkout page crash",

            description:
            "Payment fails after submit",

            priority:
            "High",

            category:
            "Frontend",

            assignee:
            "Dev Master",

            status:
            "Backlog"

        },



        {

            id:103,

            title:
            "Mobile navbar issue",

            description:
            "Menu overlaps content",

            priority:
            "Medium",

            category:
            "UI/UX",

            assignee:
            "Developer 2",

            status:
            "Todo"

        }

    ];



    saveBugs();

}







// ===============================
// INITIAL LOAD
// ===============================


loadDemo();

renderBugs();

updateStats();