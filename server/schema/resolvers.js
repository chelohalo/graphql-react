const { UserList, MovieList } = require("../FakeData");
const _ = require("lodash");

const resolvers = {
  Query: {
    //USER RESOLVERS
    users: () => {
      return UserList;
    },
    user: (parent, {id}) => {
      // const id = args.id
      const user = _.find(UserList, { id: Number(id) })
      return user
    },

    //MOVIE RESOLVERS
    movies: () => {
      return MovieList
    },
    movie: (parent, args) => {
      const name = args.name
      const movie = _.find(MovieList, { name: name } )
      return movie
    }
  },
  User: {
    favoriteMovies: () => _.filter(MovieList, (movie) => movie.yearOfPublication >= 2000  && movie.yearOfPublication <= 2010)
  },

  Mutation: {
    createUser: (parent, args) => {
      const { input } = args
      const lastId = UserList[UserList.length -1].id
      input.id = lastId + 1 
      UserList.push(input)
      return input
    },
    updateUsername: (parent, args) => {
      console.log(args)
      const { id, newUsername } = args.input
      let userUpdated
      UserList.forEach( (user) => {
        if(user.id === Number(id)) {
          user.username = newUsername
          userUpdated = user
        }
      })
      console.log(userUpdated)
      return userUpdated
    },
    deleteUser: (parent, args) => {
      console.log(args)
      const { id } = args
      _.remove(UserList, (user) => user.id === Number(id) )
      return null
    }
  }
};

module.exports = {
  resolvers
};
