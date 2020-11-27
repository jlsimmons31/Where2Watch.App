streaming_endpoint_android = "http://10.0.2.2:3098/getMovie";

is_android_test = false;

const global_vars = {
    imdb_endpoint: "https://movie-database-imdb-alternative.p.rapidapi.com/",
    imdb_headers: {
        "x-rapidapi-host": "movie-database-imdb-alternative.p.rapidapi.com",
        "x-rapidapi-key": "rMumYZoCdKycBWeXKQcoUMIjnBkCM31F"
    },
    streaming_endpoint: is_android_test ? streaming_endpoint_android : "http://ssapi.johnlsimmons.com/getMovie",
    build_jw_api_url: (query) => {
        return "https://apis.justwatch.com/content/titles/en_US/popular?language=en&body=%7B%22page_size%22:20,%22page%22:1,%22content_types%22:[%22movie%22],%22query%22:"
        + "%22" + query + "%22%7D";
        // It's basically json in the URL
        // %22's are quotes
        // %7B and %7D are { and }
    },
    build_jw_img_url: (img_path) => {
        return "https://images.justwatch.com" + img_path.replace("{profile}", "s166/image.webp");
    }
};

const colors = {
    main_blue: "#214270",
    main_background: "#F4F4F4",
    main_gray1: "#B8B8B8",
    main_gray2: "#A3A3A3",
    main_gray3: "#888888",
    main_gray4: "#7A7A7A",
    main_gray5: "#666666",
    main_white: "#FFFFFF",
    half_transparent: "#FFFFFF99"
}

module.exports = { global_vars, colors };