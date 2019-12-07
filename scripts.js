function displayAllTeams() {
    const Url='http://localhost:3000/teams';
    $.ajax({
        url: Url,
        method:"GET",
        success: result => {
            $('#tbody tr').remove();
            $.each(result.teams, (i, item) => {
                var eachrow = "<tr>"
                            + "<td>" + item.team.name + "</td>"
                            + "<td>" + item.team.price + "</td>"
                            + "<td>" + item.team._id + "</td>"
                            + "</tr>";
                $('#tbody').append(eachrow);
            })
        },
        error: error =>{
            console.log(`Error ${error}`)
        }
    });
};

function displaySpecificTeam() {
    document.getElementById("TeamSelection").addEventListener("click", function(event){
        event.preventDefault()
    });
    var id = document.getElementById('TeamID').value
    const Url2='http://localhost:3000/teams/' + id;
    $.ajax({
        url: Url2,
        method:"GET",
        success: result => {
            console.log(result);
            document.getElementById("TeamSelection").reset();
        },
        error: error =>{
            console.log(`Error ${error}`)
        }
    });
};

function postTeam() {
    document.getElementById("TeamSelection").addEventListener("click", function(event){
        event.preventDefault()
    });
    var t = new Team(
        document.getElementById('TeamClub').value,
        document.getElementById('TeamCountry').value
    );
    const Url3='http://localhost:3000/teams';
    $.ajax({
        url: Url3,
        method:"POST",
        data: t,
        success: result => {
            console.log(result);
            document.getElementById("TeamCreate").reset();
        },
        error: error =>{
            console.log(`Error ${error}`)
        }
    });
}

function team(tClub,tCountry){
    this.club = tClub;
    this.country = tCountry;
}