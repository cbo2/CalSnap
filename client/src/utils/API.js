import axios from "axios";

export default {
  // Gets all Articles
  getSavedArticles: function () {
    return axios.get("/api/articles");
  },
  // Gets the article with the given id
  getArticle: function (id) {
    return axios.get("/api/articles/" + id);
  },
  // Deletes the article with the given id
  deleteArticle: function (id) {
    return axios.delete("/api/articles/" + id);
  },
  // Saves a article to the database
  saveArticle: function (articleData) {
    return axios.post("/api/articles", articleData);
  },
  getNewArticles: (searchFormData) => {
    // use destructuring to "map" the keys from the searchFormData object into the individual variables
    const { searchTopic, startYear, endYear } = searchFormData
    console.log(`passed in items are: ${searchTopic}, ${startYear}, ${endYear}`)
    const apiKey = "4b2365b52e4e4dc98d5c8c0eea51fda7"
    // use the parameter &fl=5 to limit the results to 5 articles
    const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=${apiKey}&q=${searchTopic}&begin-date=${startYear}0101&end_date=${endYear}1231`
    return axios.get(url)
  }


};