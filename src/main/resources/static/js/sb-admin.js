(function($) {
  "use strict"; // Start of use strict
  // Configure tooltips for collapsed side navigation
  $('.navbar-sidenav [data-toggle="tooltip"]').tooltip({
    template: '<div class="tooltip navbar-sidenav-tooltip" role="tooltip" style="pointer-events: none;"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
  })
  // Toggle the side navigation
  $("#sidenavToggler").click(function(e) {
    e.preventDefault();
    $("body").toggleClass("sidenav-toggled");
    $(".navbar-sidenav .nav-link-collapse").addClass("collapsed");
    $(".navbar-sidenav .sidenav-second-level, .navbar-sidenav .sidenav-third-level").removeClass("show");
  });
  // Force the toggled class to be removed when a collapsible nav link is clicked
  $(".navbar-sidenav .nav-link-collapse").click(function(e) {
    e.preventDefault();
    $("body").removeClass("sidenav-toggled");
  });
  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $('body.fixed-nav .navbar-sidenav, body.fixed-nav .sidenav-toggler, body.fixed-nav .navbar-collapse').on('mousewheel DOMMouseScroll', function(e) {
    var e0 = e.originalEvent,
      delta = e0.wheelDelta || -e0.detail;
    this.scrollTop += (delta < 0 ? 1 : -1) * 30;
    e.preventDefault();
  });
  // Scroll to top button appear
  $(document).scroll(function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });
  // Configure tooltips globally
  $('[data-toggle="tooltip"]').tooltip()
  // Smooth scrolling using jQuery easing
  $(document).on('click', 'a.scroll-to-top', function(event) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1000, 'easeInOutExpo');
    event.preventDefault();
  });
  
      $( "#stockSearch" ).autocomplete({
        minLength: 3,
        delay: 500,
        source:'find/stocks',
        select:function(event, ui){
            
            event.preventDefault();
            
            $('#selectedStockCode').val(ui.item.value);
            $('#stockSearch').val('');

            $('#dashTitle').text(ui.item.label+' ('+ui.item.value+')');
            
            drawTable();
            
        }
    });
    
    $('#timeSeriesTable').DataTable({
        responsive: true
    });

    $('#refreshData').on('click', function (e) {
        e.preventDefault(); // disable the default form submit event

        $.ajax({
            url: 'dataload/full',
            success: function (response) {
                console.log(response);
            },
            error: function (response) {
                console.log(response);
            },
        });
    });
    
    var stockChart;
    
    function drawTable(){
        
        var dataTable = $('#timeSeriesTable').DataTable();
        
        $.getJSON('find/stocktimeseries?stockCode='+$('#selectedStockCode').val()).done(function(data) {
        
            var chartData = [];
        
            dataTable.clear();
    
            $.each( data, function( i, item ) {
                
                dataTable.row
                    .add([item.date,
                        item.open,
                        item.high,
                        item.low,
                        item.close,
                        item.tradedQuantity,
                        item.turnover]);
                    
                chartData.push([new Date(item.date), item.close])
            });
            
            dataTable.draw();
            
            drawChart(chartData);
            
        });
        
    }
    
    function drawChart(rows){
        
        stockChart.clearChart();
        
        var data = new google.visualization.DataTable();
        data.addColumn('date', 'Recorded On');
        data.addColumn('number', 'Close Value');

        data.addRows(rows);

        var options = {
            chart: {
              title: 'Stock time series data',
              subtitle: 'in Indian Rupees'
            },
            theme:'maximized'
        };
        
        stockChart.draw(data, google.charts.Line.convertOptions(options));
    }
    
    function initChart(){

        stockChart = new google.charts.Line(document.getElementById('timeSeriesGraph'));
        
        drawChart([]);
    
    }

    google.charts.load('current', {'packages':['line']});
    google.charts.setOnLoadCallback(initChart);
    
})(jQuery); // End of use strict
