const planets = fetch("https://handlers.education.launchcode.org/static/planets.json");

window.addEventListener("load", (event) => {
    let form = document.querySelector("form");

    //misc
    let planetSelect = document.getElementById("planet-select");
    let destination = document.getElementById("missionTarget");
    let faultyItems = document.getElementById("faultyItems");
    let index = Math.floor((Math.random() * 6));

    //submit fields
    let fields = {
      pilotName: document.querySelector("input[name=pilotName]"),
      copilotName: document.querySelector("input[name=copilotName]"),
      fuelLevel: document.querySelector("input[name=fuelLevel]"),
      cargoMass: document.querySelector("input[name=cargoMass]")
    };

    //field status
    let pilotStatus = document.getElementById("pilotStatus");
    let copilotStatus = document.getElementById("copilotStatus");
    let fuelStatus = document.getElementById("fuelStatus");
    let cargoStatus = document.getElementById("cargoStatus");
    let launchStatus = document.getElementById("launchStatus");

    planets.then((response) => {
        response.json().then((json) => {
            planetSelect.addEventListener("click", (event) => {
                destination.innerHTML = `<h3>
                    Planet: ${json[index].name} <br />
                    Distance: ${json[index].distance}<br />
                    Moons: ${json[index].moons} <br />
                    Star: ${json[index].star}<br />
                    Diameter: ${json[index].diameter} <br />
                    </h3><br />
                    <img src = ${json[index].image}>`;
                    index = Math.floor((Math.random() * 6))
            });
        });
    });

    form.addEventListener("submit", (event) => {
        let goForLaunch = fieldValidate(fields);

        if (goForLaunch === true ){
            event.preventDefault();
            pilotStatus.innerHTML = "Pilot "+fields.pilotName.value+" ready.";
            copilotStatus.innerHTML = "Copilot "+fields.copilotName.value+" ready.";
            fuelStatus.innerHTML = "Fuel level high enough for launch.";
            cargoStatus.innerHTML = "Cargo mass low enough for launch.";
            launchStatus.innerHTML = "Go for launch!";
            launchStatus.style.color = "green";
            faultyItems.style.visibility = "visible";
        }
    });
});

function fieldValidate(fields) {
    event.preventDefault();
    let failTypes = [];
    let nums = /[0-9]/g;

    if (fields.pilotName.value === "" || fields.copilotName.value === "" ||
    fields.fuelLevel.value === "" || fields.cargoMass.value === "") {
        failTypes.push("emptyField");
    }

    if (!isNaN(fields.pilotName.value)) {
        failTypes.push("pilotError");
    }

    if (!isNaN(fields.copilotName.value)) {
        failTypes.push("copilotError");
    }

    if (fields.fuelLevel.value < 10000) {
        failTypes.push("fuelError");
    }

    if (fields.cargoMass.value > 10000) {
        failTypes.push("cargoError");
    }

    if (isNaN(fields.fuelLevel.value+fields.cargoMass.value) || 
    (fields.pilotName.value+fields.copilotName.value).match(nums)) {
        failTypes.push("invalidInfo")
    }

    if (failTypes.length > 0) {
        message(failTypes, fields)
        return false
    }

    return true
}

function message(failTypes, fields) {
    if (failTypes.includes("emptyField")) {
        alert("All fields are required!");
        return;
    }

    if (failTypes.includes("invalidInfo")) {
        alert("Make sure to enter valid information for each field!");
        return;
    }

    faultyItems.style.visibility = "visible";
    launchStatus.style.color = "red";
    launchStatus.innerHTML = "LAUNCH ABORTED";
    goForLaunch = false;

    for (i in failTypes) {
        switch(failTypes[i]) {
          case "pilotError":
            pilotStatus.innerHTML = "Pilot "+fields.pilotName.value+" not ready.";
            break;
          case "copilotError":
            copilotStatus.innerHTML = "Copilot "+fields.copilotName.value+" not ready.";
            break;
          case "fuelError":
            fuelStatus.innerHTML = "Fuel level too low.";
            break;
          case "cargoError":
            cargoStatus.innerHTML = "Cargo mass too high.";
            break;
        }
    }

    if (!failTypes.includes("pilotError")) {
        pilotStatus.innerHTML = "Pilot "+fields.pilotName.value+" ready."
    }

    if (!failTypes.includes("copilotError")) {
        copilotStatus.innerHTML = "Copilot "+fields.copilotName.value+" ready."
    }
}

// // This block of code shows how to format the HTML once you fetch some planetary JSON!
// <h2>Mission Destination</h2>
// <ol>
//    <li>Name: ${}</li>
//    <li>Diameter: ${}</li>
//    <li>Star: ${}</li>
//    <li>Distance from Earth: ${}</li>
//    <li>Number of Moons: ${}</li>
// </ol>
// <img src="${}">
// //
