var artistName = "";


$(document).ready(function(){

// On click event for Artist search button
$("#searchBtn").on("click", function(event){
    event.preventDefault();

    artistName = $("#artistSearch").val().trim();
    if(artistName === ""){
        return false;
    }else{
        renderArtist();
    }
});

$("#artistSearch").keypress(function(e){
    if(e.which == 13){
        $("#searchBtn").click();
    }
})

async function renderArtist() {

    var artistURL = "https://rest.bandsintown.com/artists/"+artistName+"?app_id=b2db6f8ebd0c23dae6b949ccfe84dec1";

    var response = await $.ajax({
        url: artistURL,
        method: "GET"
      })
    //   console.log(response);
      var {thumb_url, name} = response
      var displayArtistDiv = $("<div class='twelve columns' id='ArtistImg'>");
      var displayName = $("<h3>").text(name);
        displayName.addClass("artistHeader");
        displayArtistDiv.append(displayName);
      var artistImg = $("<img src ='"+thumb_url+"'/>");
        displayArtistDiv.append(artistImg);

      var eventURL = "https://rest.bandsintown.com/artists/"+artistName+"/events?app_id=b2db6f8ebd0c23dae6b949ccfe84dec1";
      var eventResponse = await $.ajax({
          url: eventURL,
          method: "GET"
      })

      var eventTable = $("<table class=u-full-width>");
      var eventTableHead = $("<thead>");
        eventTable.append(eventTableHead);
      var headTableRow = $("<tr>");
      var headTableDate = $("<th>").text("Show Date");
        headTableRow.append(headTableDate);
      var headTableCity = $("<th>").text("City");
        headTableRow.append(headTableCity);
      var headTableCountry = $("<th>").text("Country");
        headTableRow.append(headTableCountry);
      var headTableVenue = $("<th>").text("Venue");
        headTableRow.append(headTableVenue);
      var headTableTickets = $("<th>").text("Tickets");
        headTableRow.append(headTableTickets);
        eventTableHead.append(headTableRow);
      var eventTableBody = $("<tbody class= u-max-width>");
        eventTable.append(eventTableBody);
      
    //   console.log(eventResponse);

    if(eventResponse.length === 0){
          var noShows = $("<tr>").text("**No shows available**");
          noShows.addClass("noshows");
          eventTable.empty();
          eventTable.append(noShows);
    }

      let i=0;
        while (i<5 && i<eventResponse.length){
          var getShowDate = eventResponse[i].datetime;
          var convertShowDate = new Date(getShowDate).toDateString();
          var bodyTableRow = $("<tr>");
          var bodyTableDate = $("<td>").text(convertShowDate);
            bodyTableRow.append(bodyTableDate);
          var getCity = eventResponse[i].venue.city;
          var bodyShowCity = $("<td>").text(getCity);
            bodyTableRow.append(bodyShowCity);
          var getCountry = eventResponse[i].venue.country;
          var bodyShowCountry = $("<td>").text(getCountry);
            bodyTableRow.append(bodyShowCountry);
          var getVenue = eventResponse[i].venue.name;
          var bodyShowVenue = $("<td>").text(getVenue);
            bodyTableRow.append(bodyShowVenue);
        if (eventResponse[i].offers.length == 0){
              bodyTicketLink = $("<p>").text("Tickets Unavaible");
        }else{          
          var getTicketLink = eventResponse[i].offers[0].url;
          var bodyTicketLink = $("<a href="+getTicketLink+" target='_blank'>").text("Buy Tickets");
          }
          var bodyTicketLinkTD = $("<td>");
            bodyTicketLinkTD.append(bodyTicketLink);
            bodyTableRow.append(bodyTicketLinkTD);

            i++;
            eventTableBody.append(bodyTableRow);
        }
        
        displayArtistDiv.append(eventTable);
      
      $(".bandsInTown").html(displayArtistDiv);
      $('body, html').animate({
        scrollTop: $(".bandsInTown").offset().top+305
      }, 600);

      renderResultsBtns();

};

// Renders the Search Again and See Related Artists buttons
function renderResultsBtns(){
    var buttonDiv = $("<div class='twelve columns'>");
    var searchAgain = $("<button class='button-primary' id='searchAgain'>").text("Search Again");
        buttonDiv.append(searchAgain);
    var relatedArtists = $("<button class='button-primary' id='relatedArtists'>").text("See Related Artists");
        buttonDiv.append(relatedArtists);

    $(".resultsBtns").html(buttonDiv);

};

async function renderRelatedArtists(){
    var artistURL = "https://cors-anywhere.herokuapp.com/https://tastedive.com/api/similar?q="+artistName+"&type=music&info=1&limit=5&k=360014-InClassP-M0LL63LP";
    var artistResponse = await $.ajax({
        url: artistURL,
        method: "GET"
      })
      var relatedTable = $("<table class='u-full-width'>");
      var relatedTableHead = $("<thead>");
        relatedTable.append(relatedTableHead);
      var relatedTableHeadRow = $("<tr>");
        relatedTableHead.append(relatedTableHeadRow);
      var headArtist = $("<th>").text("Artist Name").addClass("modalEl");
        relatedTableHeadRow.append(headArtist);
      var headWiki = $("<th>").text("Artist's Wiki Page").addClass("modalEl");
        relatedTableHeadRow.append(headWiki);
      var headVideo = $("<th>").text("YouTube Video").addClass("modalEl");
        relatedTableHeadRow.append(headVideo);
      var relatedTableBody = $("<tbody>");
        relatedTable.append(relatedTableBody);
        console.log(artistResponse);
      
    if (artistResponse.Similar.Results.length > 0){
      for (i=0; i<5; i++){
          var getArtistName = artistResponse.Similar.Results[i].Name;
          var bodyTableRow = $("<tr>");
          var bodyArtistName = $("<td>").text(getArtistName).addClass("modalEl");
          bodyTableRow.append(bodyArtistName);
          var getArtistWiki = artistResponse.Similar.Results[i].wUrl;
          var bodyArtistWiki = $("<td>").html("<a href='"+getArtistWiki+"' target='_blank'>Artist Wiki</a>").addClass("modalEl");
          bodyTableRow.append(bodyArtistWiki);
          var getArtistVideo = artistResponse.Similar.Results[i].yID;
          var bodyArtistVideo = $("<td>").html("<iframe width='560' height='315' src='https://www.youtube.com/embed/" + getArtistVideo + "' frameborder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>").addClass("modalEl");
          bodyTableRow.append(bodyArtistVideo);

          relatedTableBody.append(bodyTableRow);
        }
    }else{
        relatedTable.empty();
        var noRelated = $("<tr>").text("**No Related Artists Found**");
            noRelated.addClass("noArtistFound");
            relatedTable.append(noRelated);
    }
    // console.log(artistResponse);
    // console.log(artistResponse.Similar.Results);
    
    $("#related-artists").html(relatedTable);
      
}

// When the user clicks the Search Again button, reload the page
$(".resultsBtns").on("click", "#searchAgain", function(){
    // location.reload(true);
    var artistSearch = $("#artistSearch");
        artistSearch.val("");
    $('html, body').animate({ scrollTop: 0}, 1000);
        artistSearch.focus();
    return false;
});

// When the user clicks the button, open the modal 
$(".resultsBtns").on("click", "#relatedArtists", function() {
    $("#myModal").show();
    renderRelatedArtists();
    $(".modal").scrollTop(0);

});

// When the user clicks on <span> (x), close the modal
$(".close").on("click", function() {
    $("#myModal").hide();
});

// When the user clicks anywhere outside of the modal, close it
$(".modal-click-catcher").on("click", function() {

    $("#myModal").hide();

});

$(document).keydown(function(event) { 
    if (event.keyCode == 27) { 
      $('#myModal').hide();
    }
  });

});