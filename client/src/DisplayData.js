import React, { useState } from 'react'
import { useQuery, useLazyQuery, gql, useMutation } from '@apollo/client'

const QUERY_ALL_USERS = gql`
  query GetAllUsers{
    users {
      id
      name
      age
      username
      nationality
    }
  }
`
const QUERY_ALL_MOVIES = gql`
  query GetAllMovies {
    movies {
      id
      name
      isInTheaters
    }
  }
`

const GET_MOVIE_BY_NAME = gql`
  query Movie($name: String!) {
    movie(name: $name) {
      name
      yearOfPublication
    }
  }
`

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      name
      id
    }
  }
`

const UPDATE_USERNAME_MUTATION = gql`
  mutation UpdateUsername($input: UpdateUsernameInput!){
    updateUsername(input: $input) {
      id
      newUsername
    }
  }
`

const DisplayData = () => {
  const [movieSearched, setMovieSearched] = useState("")

  // Create user state
  const [newUser, setNewUser] = useState({
    name: '',
    username: '',
    age: 0,
    nationality: ''
  })

  const [showUpdate, setShowUpdate] = useState(false)
  const [index, setIndex] = useState({
    idx: '',
    id: ''
  })

  const { data: userData, refetch } = useQuery(QUERY_ALL_USERS)
  const { data: movieData } = useQuery(QUERY_ALL_MOVIES)

  const [
    fetchMovie,
    { data: movieSearchData, error: movieError }
  ] = useLazyQuery(GET_MOVIE_BY_NAME)

  const [createUser] = useMutation(CREATE_USER_MUTATION)
  const [updateUsername] = useMutation(UPDATE_USERNAME_MUTATION)

  const handleNewUser = (e) => {
    if (e.target.name === 'age') {
      setNewUser({
        ...newUser,
        [e.target.name]: Number(e.target.value)
      })
    } else {
      setNewUser({
        ...newUser,
        [e.target.name]: e.target.value
      })
    }
  }

  console.log(typeof (newUser.age))

  return (
    <div>
      <div>
        {!showUpdate &&
          <input type='text' name='name' value={newUser.name} onChange={handleNewUser} placeholder='Name...' />
        }
        <input type='text' name='username' value={newUser.username} onChange={handleNewUser} placeholder='Username...' />
        {
          !showUpdate &&
          <input type='number' name='age' value={newUser.age} onChange={handleNewUser} placeholder='Age...' />
        }
        {!showUpdate &&
          <select type='select' name='nationality' value={newUser.nationality} onChange={handleNewUser} placeholder='Nationality...'>
            <option disabled select>--Select--</option>
            <option value='BRAZIL' selected>Brazil</option>
            <option value='CANADA'>Canada</option>
            <option value='CHILE'>Chile</option>
            <option value='GERMANY'>Germany</option>
            <option value='INDIA'>India</option>
          </select>
        }
        {
          showUpdate ?
            <div>
              <button onClick={() => {
                console.log('holaaaa')
                updateUsername({
                  attributes: {
                    id: index.id,
                    newUsername: newUser.username
                  }
                });
                refetch();
                console.log('ok')
              }}>
                Confirm Update
              </button>
              <button onClick={() => {
                setShowUpdate(!showUpdate)
                setIndex({
                  idx: '',
                  id: ''
                })
              }}>
                Cancel
              </button>

            </div>
            :
            <button onClick={
              () => {
                createUser({ variables: { input: newUser } });
                refetch();
                setNewUser({
                  name: '',
                  username: '',
                  age: 0,
                  nationality: ''
                })
              }
            }> Create User </button>
        }
      </div>
      {userData && userData.users.map((user, idx) =>

        <div className={`${idx === index.idx ? 'On' : 'Off'} Card`}>
          <h1>Name: {user.name}</h1>
          <h1>Age: {user.age}</h1>
          <h1>Id: {user.id}</h1>
          <h1>Username: {user.username}</h1>
          <h1>Nationality: {user.nationality}</h1>
          <button onClick={() => {

            setShowUpdate(true)
            setIndex({
              idx: idx,
              id: user.id
            })
          }}>Update</button>
        </div>

      )}

      {movieData && movieData.movies.map((movie) =>

        <div>
          <h1>Name: {movie.name}</h1>
          <h1>Is in theaters: {movie.isInTheaters.toString()}</h1>
        </div>

      )}

      <div>
        <input type="text" placeholder='Insterstellar...' value={movieSearched} onChange={(e) => setMovieSearched(e.target.value)} />
        <button onClick={() => {
          fetchMovie({
            variables: {
              name: movieSearched
            }
          })
        }}
        >
          Fetch Data
        </button>
        <div>
          {movieSearchData &&
            <div>
              <h1>Movie Name: {movieSearchData.movie.name} </h1>
              <h1>Year of Publication: {movieSearchData.movie.yearOfPublication} </h1>
            </div>
          }
          {movieError && <h1>There was an error while fetching the data</h1>}
        </div>
      </div>

    </div>
  )
}

export default DisplayData