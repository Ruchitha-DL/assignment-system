const deadline = new Date("2026-04-01");

function login(){
let name=document.getElementById("name").value;
localStorage.setItem("student",name);
window.location="student.html";
}

// SUBMIT
function submitAssignment(){

let student = localStorage.getItem("student");
let title = document.getElementById("title").value;
let subject = document.getElementById("subject").value;
let file = document.getElementById("file").files[0];

let reader = new FileReader();

reader.onload = function(){

let status = "Submitted";

if(new Date()>deadline){
status = "Late Submission";
}

fetch("http://localhost:8080/submit",{

method:"POST",

body:JSON.stringify({
student, title, subject,
file:reader.result,
status,
grade:"Not graded"
})

}).then(()=>alert("Submitted"));

};

reader.readAsDataURL(file);
}

// LOAD
function loadAssignments(){

fetch("http://localhost:8080/assignments")
.then(res=>res.json())
.then(data=>{

let list=document.getElementById("list");
list.innerHTML="";

let graded=0;

data.forEach((a,index)=>{

if(a.status==="Graded") graded++;

let li=document.createElement("li");

li.innerHTML=
`<b>${a.student}</b><br>
${a.title} (${a.subject})<br>
Status: ${a.status}<br>
Grade: ${a.grade}
<a href="${a.file}" download>Download</a>
<button onclick="gradeAssignment(${index})">Grade</button>`;

list.appendChild(li);

});

showChart(data,graded);

});
}

// GRADE
function gradeAssignment(){
let g=prompt("Enter Grade");

fetch("http://localhost:8080/grade",{
method:"POST",
body:g
}).then(()=>alert("Updated"));
}

// CHART
function showChart(data,graded){

let total=data.length;
let pending=total-graded;

new Chart(document.getElementById("chart"),{
type:'pie',
data:{
labels:["Graded","Pending"],
datasets:[{data:[graded,pending]}]
}
});
}

// COUNTDOWN
setInterval(()=>{

let el=document.getElementById("countdown");
if(!el) return;

let diff=deadline-new Date();
let days=Math.floor(diff/(1000*60*60*24));

el.innerHTML="Days left: "+days;

},1000);