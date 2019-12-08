function displayAllJerseys() {
    const Url='http://localhost:3000/jerseys';
    $.ajax({
        url: Url,
        method:"GET",
        success: result => {
            $('#tbody tr').remove();
            $.each(result.jerseys, (i, ittem) => {
                var eachrow = "<tr>"
                            + "<td>" + ittem.jersey.name + "</td>"
                            + "<td>" + ittem.jersey.price + "</td>"
                            + "<td>" + ittem.jersey._id + "</td>"
                            + "</tr>";
                $('#tbody').append(eachrow);
            })
        },
        error: error =>{
            console.log(`Error ${error}`)
        }
    });
};

function displaySpecificJersey() {
    document.getElementById("JSelect").addEventListener("click", function(event){
        event.preventDefault()
    });
    var id = document.getElementById('JerseyID').value
    const Url2='http://localhost:3000/jerseys/' + id;
    $.ajax({
        url: Url2,
        method:"GET",
        success: result => {
            console.log(result);
            document.getElementById("JSelect").reset();
        },
        error: error =>{
            console.log(`Error ${error}`)
        }
    });
};

function postJersey() {
    document.getElementById("JSelect").addEventListener("click", function(event){
        event.preventDefault()
    });
    var j = new Jersey(
        document.getElementById('jName').value,
        document.getElementById('jPrice').value
    );
    const Url3='http://localhost:3000/jerseys';
    $.ajax({
        url: Url3,
        method:"POST",
        data: j,
        success: result => {
            console.log(result);
            document.getElementById("JCreate").reset();
        },
        error: error =>{
            console.log(`Error ${error}`)
        }
    });
}

function jersey(jName,jPrice){
    this.name = jName;
    this.price = jPrice;
}