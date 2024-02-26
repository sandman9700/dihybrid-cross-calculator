var themeButtons = $(".theme-button");

themeButtons.click(function () {
    if ($(this).hasClass("dark-theme")) {
        $(":root").css({
            "--bg": "#c8c8c8",
            "--calc": "#ffffff",
            "--text": "#555555",
            "--gen": "#ff8330",
            "--phen": "#3992db"
        });

        themeButtons.removeClass("bi-sun");
        themeButtons.addClass("bi-moon");
        themeButtons.removeClass("dark-theme");
        themeButtons.addClass("light-theme");
    } else {
        $(":root").css({
            "--bg": "#616161",
            "--calc": "#1a1a1a",
            "--text": "#cfcfcf",
            "--gen": "#722599",
            "--phen": "darkgreen"
        });

        themeButtons.removeClass("bi-moon");
        themeButtons.addClass("bi-sun");
        themeButtons.removeClass("light-theme");
        themeButtons.addClass("dark-theme");
    }
});