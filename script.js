var artistName = "";

// On click event for Artist search button
$("#searchBtn").on("click", function(event){
    event.preventDefault();

    artistName = $("#artistSearch").val().trim();
    if(artistName === ""){
        return false;
    }else{
        renderArtist();
    }
    $('body, html').animate({
        scrollTop: $(".bandsInTown").offset().top+220
      }, 600);
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
      console.log(response);
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
      var headTableVenue = $("<th>").text("Venue");
      headTableRow.append(headTableVenue);
      var headTableTickets = $("<th>").text("Tickets");
      headTableRow.append(headTableTickets);
      eventTableHead.append(headTableRow);
      var eventTableBody = $("<tbody class= u-max-width>");
      eventTable.append(eventTableBody);
      
      console.log(eventResponse);

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



}

