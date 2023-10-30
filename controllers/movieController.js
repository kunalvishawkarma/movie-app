const session = require("express-session");
const { Movie } = require("../models/allModel");

// Retrieve a list of movies.

const moviesList = async (req, res) => {
  console.log("runnign")
  try {
    const movies = await Movie.find(
      {},
      {
        rating: 0,
        reviews: 0,
        genres: 0,
        actors: 0,
        directors: 0,
      }
    );

    res.status(200).send({ status: "sucess", movies_name: movies });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
};

// Get details of a specific movie.

const speceficMovie = async (req, res) => {
  try {
    // const id = req.body.id || rs

    const id = req.params.id || req.body;

    const movies = await Movie.findById(
      { _id: id },
      {
        rating: 0,
        reviews: 0,
        genres: 0,
        actors: 0,
        directors: 0,
      }
    );

    res.status(200).send({ status: "sucess", movies: movies });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
};

// Get rated movies for a user

const rateMovie = async (req, res) => {
  try {
    const id = req.params.id || req.body.rate;
    const rate = req.body.rate || req.params.rate;
    console.log(id, rate);
    const date = await Movie.updateOne(
      { _id: id }, // Match the document with _id = 1
      {
        $push: {
          rating: {
            userId: req.session.user_session?._id,
            ratings: rate,
          },
        },
      }
    );

    // const movie = await Movie.findByIdAndUpdate(
    //   { _id: id },
    //   { $set: { rating: rate } },
    //   { new: true }
    // );

    res.status(200).send({ status: "sucess", movies: date });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
};

// Get movie reviews submitted by a user

const getReviews = async (req, res) => {
  try {
    const _id = req.body.id || req.params.id;
    console.log(_id);

    const movie = await Movie.findById(
      { _id },
      {
        rating: 0,
        genres: 0,
        actors: 0,
        directors: 0,
      }
    );

    res.status(200).send({ status: "sucess", reviews: movie });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
};

// Create a new review.

const createReview = async (req, res) => {
  try {
    const { reviews } = req.body;
    const date = await Movie.updateOne(
      { _id: req.session.user_session?._id }, // Match the document with _id = 1
      {
        $push: {
          rating: {
            userId: req.session.user_session._id,
            reviews: reviews,
          },
        },
      }
    );
    // const result = await Movie({ user_id, reviews, title, rating });
    // const data = await result.save();

    res.status(200).send({ msg: "you have created this review ", data: data });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
};

//  Get details of a specific review..

const specificReview = async (req, res) => {
  try {
    const id = req.body.id || req.params.id;

    const reviewdData = await Movie.find(
      { _id: id },
      {
        _id: 0,
        rating: 0,
        genres: 0,
        actors: 0,
        directors: 0,
      }
    );

    res
      .status(200)
      .send({ msg: "Here is the data you want  ", data: reviewdData });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
};

// Edit an existing review.

const editeExistReview = async (req, res) => {
  try {
    const review = req.body.review || req.body.params;
    const _id = req.params.id || req.body.id;
    

    const data = await Movie.updateOne(
      {
        "reviews.userId": _id,
        //  "reviews.userId":req.session.user_session?._id  // Find the specific element to update
      },
      {
        $set: {
          "reviews.$.review": review, // Use the positional operator $
        },
      }
    );

    const uptdateData = await Movie.find(
      { "reviews.userId": _id },
      {
        id: 0,
        title: 0,
        genres: 0,
        actors: 0,
        directors: 0,
        rating: 0,
      }
    );

    res
      .status(200)
      .send({ msg: "you have edie this review ", data: uptdateData });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
};

// Delete a review.


const deleteReview = async (req, res) => {
  try {
    const _id = req.body.id || req.params.id;

    const data = await Movie.updateOne({
      $or: [
         {"reviews.userId":_id },
      ]
   },
   {"$unset":{
    "reviews.review":"",
    "reviews.userId":""
   }}
   );
   

   console.log(f)
    res.status(200).send({ msg: ` review  deleted  ` });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
};

// search point

const searchMovie = async (req, res) => {

  try {

    const { title, genre } = req.query 
  
    const movie = await Movie.find({
      $or: [{ title: title }, { genres: genres }],
    },{
      _id:0,
      genres:0,
      
    });
   
   
      res.status(200).send({ msg: "here is the movie", movieData: movie });
    

 
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
};



// Get movie recommendations for a user based on their preferences.

const recomondationMovie = async (req, res) => {
  try {
    const {prefrence} =  req.query
    console.log(prefrence)

    const movieData = await Movie.find({ genres: prefrence });

    res.send({ msg: "here is the movies", data: movieData });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
};

// Miscellaneous Endpoints:

// funtion that remove same value in object ;

function removeDuplicateValues(obj) {
  const uniqueValues = {}; // Initialize an empty object to store unique values
  const newObj = {}; // Initialize a new object to store the result

  for (const key in obj) {
    const value = obj[key];

    // Check if the value is not already in the uniqueValues object
    if (!uniqueValues.hasOwnProperty(value)) {
      newObj[key] = value; // Add the unique value to the new object
      uniqueValues[value] = true; // Mark the value as seen in the uniqueValues object
    }
  }

  return newObj;
}

// Retrieve a list of available genres

const genres = async (req, res) => {
  try {
    const genresData = await Movie.find();
    const data = genresData.map((data, i) => {
      return data.genres;
    });

    const uniqueObject = removeDuplicateValues(data);
    console.log(uniqueObject);
    res
      .send({ msg: "here is the availble genres ", data: uniqueObject })
      .status(200);
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
};

// Retrieve a list of actors.

const actors = async (req, res) => {
  try {
    const genresData = await Movie.find();
    const data = genresData.map((data, i) => {
      return data.actors;
    });
    const uniqueObject = removeDuplicateValues(data);
    res.send({ msg: "here is the availble actors ", data: uniqueObject });

    res.status(200);
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
};

//  Retrieve a list of directors.

const directors = async (req, res) => {
  try {
    const genresData = await Movie.find();
    const data = genresData.map((data, i) => {
      return data.directors;
    });

    const uniqueObject = removeDuplicateValues(data);

    res
      .send({ msg: "here is the availble directors ", data: uniqueObject })
      .status(200);
    // res.json(uniqueObject);
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
};

module.exports = {
  moviesList,
  speceficMovie,
  rateMovie,
  getReviews,
  createReview,
  specificReview,
  editeExistReview,
  deleteReview,
  searchMovie,
  recomondationMovie,
  genres,
  actors,
  directors,
};
