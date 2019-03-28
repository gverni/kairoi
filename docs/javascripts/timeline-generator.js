// https://davidwalsh.name/query-string-javascript
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  function downloadSvg() {
    var svg = document.querySelector("svg");
    var serializer = new XMLSerializer();
    var source = serializer.serializeToString(svg); //add name spaces.

    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
      source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    } //add xml declaration


    source = '<?xml version="1.0" standalone="no"?>\r\n' + source; //convert svg source to URI data scheme.

    var svgUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source); // Create an A tag and click to download

    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "timeline.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  function generateChart() {
    document.getElementById('project-timeline').innerHTML = '';
    var data = [];
    document.getElementById('milestones').value.split('\n').forEach(function (row) {
      let tmpMilestone = {};
      let parsedRow = row.split('|');

      if (parsedRow.length >= 2) {
        tmpMilestone.date = new Date(parsedRow[0].trim());
        tmpMilestone.milestone = parsedRow[1].trim();

        if (parsedRow.length === 3) {
          tmpMilestone.labelBgColor = parsedRow[2].trim();
        }

        data.push(tmpMilestone);
      }
    });
    var chart = new Kairoi('#project-timeline', {
      initialWidth: document.querySelector('#form-width').value,
      initialHeight: document.querySelector('#form-height').value,
      labelBgColor: "#777",
      textFn: function (d) {
        return d.milestone;
      }
    });
    chart.data(data);
    chart.draw();

    // Show the download button
    document.getElementById('timeline-buttons').style.display = 'inherit'; // Update the url (for bookmark)
    history.pushState({}, "", "index.html?width=" + document.getElementById('form-width').value + "&height=" + document.getElementById('form-height').value + "&milestones=" + encodeURI(document.getElementById('milestones').value));
  }

  if (window.location.search) {
    document.getElementById('form-width').value = getUrlParameter('width') || '1200';
    document.getElementById('form-height').value = getUrlParameter('height') || '1200';
    milestonesParam = getUrlParameter('milestones');

    if (milestonesParam) {
      document.getElementById('milestones').value = milestonesParam;
    }
  }
