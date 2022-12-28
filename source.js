const container = document.querySelector(".container-fluid");
const home_btn = document.querySelector("#home_btn");
const all_jobs_btn = document.querySelector("#all_jobs_btn");
const categories_dropdown = document.querySelector("#categories_dropdown");
const saved_jobs = document.querySelector("#saved_jobs");

//Home Page html
const home_page_display = `<br><h1>Wellcom to our jobs search service</h1><br>
<p>To use our service all what you need is a good heart, and a little mind 🤠</p>
<br><hr><h5>Enjoy</h5>`;

//Spinner function
const spinner = () => {
  const div = document.createElement("div");
  div.classList.add("spinner-border");
  div.style.padding = "5%";
  div.style.margin = "5%";
  container.append(div);
};

const firstLoad = async () => {
  //home page display
  container.innerHTML = home_page_display;
  //fill up categories options
  const response = await fetch(
    `https://remotive.com/api/remote-jobs/categories`
  );
  const data = await response.json();
  data.jobs.map((category) => {
    const a = document.createElement("a");
    a.classList.add("dropdown-item");
    a.append(category.name);
    categories_dropdown.append(a);
  });
};
//First load
firstLoad();

//Home button
home_btn.addEventListener("click", () => {
  container.innerHTML = "";
  container.innerHTML = home_page_display;
});

//all jobs button
all_jobs_btn.addEventListener("click", async () => {
  container.innerHTML = "";
  spinner();
  try {
    const response = await fetch(
      `https://remotive.com/api/remote-jobs?limit=50`
    );
    const data = await response.json();
    container.innerHTML = "";
    buildCards(data.jobs);
  } catch (err) {
    console.log(err);
  }
});

//Categories buttons
categories_dropdown.addEventListener("click", async (e) => {
  container.innerHTML = "";
  spinner();
  const response = await fetch(
    `https://remotive.com/api/remote-jobs?category=${e.target.innerHTML}`
  );
  const data = await response.json();
  container.innerHTML = "";
  buildCards(data.jobs);
});



//Search input
const search = async (value) => {
  container.innerHTML = "";
  spinner();
  const response = await fetch(
    `https://remotive.com/api/remote-jobs?search=${value}`
  );
  const data = await response.json();
  container.innerHTML = "";
  buildCards(data.jobs);
};




//Save button function
const saveBtn = (target, target_id, company_name) => {
  let arr_of_saved_jobs = JSON.parse(localStorage.getItem("arr_of_saved_jobs"))
    ? JSON.parse(localStorage.getItem("arr_of_saved_jobs"))
    : [];

  if (target.className === "btn ml-2") {
    target.className = "heart btn ml-2";
    target.style.backgroundColor = "red";
    target.innerHTML = "Remove";
    //Save job on localStorage
    let obj = {
      target_id: target_id,
      company_name: company_name,
    };
    //update arr_of_saved_jobs with the new saved job
    arr_of_saved_jobs = [obj, ...arr_of_saved_jobs];
    //update localStorage with the new arr_of_saved_jobs
    localStorage.setItem(
      "arr_of_saved_jobs",
      JSON.stringify(arr_of_saved_jobs)
    );
  } else {
    //toggle back to normal
    target.className = "btn ml-2";
    target.style.backgroundColor = "#FFC0CB"; //#DE3163
    target.innerHTML = "Save this JOB ";
    
    let filtered_saved_jobs = JSON.parse(
      localStorage.getItem("arr_of_saved_jobs")
    );
    //Make new updated new_arr
    let new_arr = filtered_saved_jobs.filter(
      (job) => job.target_id != target_id
    );
    //Update the localStorage
    localStorage.setItem("arr_of_saved_jobs", JSON.stringify(new_arr));
  }};



//Saved jobs
saved_jobs.addEventListener("click", async (e) => {
let company_names_and_id = JSON.parse(localStorage.getItem("arr_of_saved_jobs"));
//If empty
if(company_names_and_id.length==0){
 container.innerHTML='<br> <h1>Sorry, you have not selected any job</h1> '
}
  let array_of_all_saved = [];

  company_names_and_id.map(async (item) => {  
  container.innerHTML=''
    const response = await fetch(`https://remotive.com/api/remote-jobs?company_name=${item.company_name}`);
    const data = await response.json();
    
    //Mybe more the one job at the same company 
    if (data.jobs.length > 1) {
        //If yes check that the id metch to one of the element.id in the company_names_and_id array 
      data.jobs.map((job) => {
        if (job.id == item.target_id) {
          array_of_all_saved.push(job);
        }
      });
    } else {
      array_of_all_saved.push(data.jobs[0]);
    }
    container.innerHTML = ''
    //buildCards 
    buildCards(array_of_all_saved)
     
    //Get all the buttons and add Event for remove when click
   const buttons = document.querySelectorAll('.heart')
   buttons.forEach(button=>{
    button.addEventListener('click',(e)=>{
        e.target.parentNode.parentNode.parentNode.remove()
        //Refresh the page
        saved_jobs.click()
    })
   })
  }); 
});


///Create cards function (get arr of categories/all_jobs/save_jobs) and building the cards * I put the code outside for avoid duplication code
const buildCards = (array) => {
    //Take the saved_jobs_from_local and in the following code update
  let saved_jobs_from_local = JSON.parse(localStorage.getItem("arr_of_saved_jobs"))
    ? JSON.parse(localStorage.getItem("arr_of_saved_jobs"))
    : [];

  const row = document.createElement("div");
  row.classList.add("row");

  array.map((item) => {
    const div_1 = document.createElement("div");
    div_1.setAttribute(
      "class",
      "col-xs-7 col-sm-6 col-lg-6 col-xl-4  d-flex align-items-stretch"
    );

    const div_2 = document.createElement("div");
    div_2.setAttribute("class", "card bg-light mb-3 border-primary");
    const div_3 = document.createElement("div");
    div_3.setAttribute("class", "card-header text-center");
    div_3.append(`Company Name : ${item.company_name ?? ""}`);

    const img = document.createElement("img");
    img.setAttribute("src", item.company_logo ?? "");
    img.style = "max-height: 150px; object-fit: contain; margin-top: 20px;";

    const card_body = document.createElement("div");
    card_body.classList.add("card-body");

    const h5 = document.createElement("h5");
    h5.setAttribute(
      "class",
      "card-title text-center text-decoration-underline"
    );

    h5.append(item.title ?? "");
    const p2 = document.createElement("p");
    p2.classList.add("card-text");
    p2.innerHTML = `${item.description ?? ""}`;
    p2.style = "min-height: 280px; max-height: 280px; overflow: scroll;";

    const p1 = document.createElement("p");
    p1.classList.add("card-text");
    p1.append(`Salary : ${item.salary ?? ""}`);

    const a = document.createElement("a");
    a.setAttribute("class", "btn btn-success");
    a.setAttribute("href", item.url ?? "");
    a.setAttribute("target", "_blank");
    a.style.marginLeft = "12px";
    a.append("See this JOB");

    const button = document.createElement("button");
    button.setAttribute("class", "btn ml-2");
    button.style.backgroundColor = "#FFC0CB";
    button.innerHTML = "Save this JOB ";

    //Check if buttons pressed  if yes upadate
    saved_jobs_from_local.map((job) => {
      if (item.id == job.target_id) {
        button.className = "heart btn ml-2";
        button.style.backgroundColor = "red";
        button.innerHTML = "Remove";
      }
    });
    const buttuns_div = document.createElement("div");
    buttuns_div.classList.add("buttuns_div");
    buttuns_div.append(a, button);

    //Activate save button function
    button.addEventListener("click", (e) => {
      saveBtn(e.target, item.id, item.company_name);
    });

    const card_footer = document.createElement("div");
    card_footer.setAttribute("class", "card-footer text-muted");
    card_footer.append(`Type : ${item.job_type ?? ""}`);

    card_body.append(h5, p1, p2, buttuns_div);
    div_2.append(div_3, img, card_body, card_footer);
    div_1.append(div_2);
    row.append(div_1);
    container.append(row);
  });
};
