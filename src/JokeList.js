import React, { Component } from "react";
import axios from 'axios';
import './JokeList.css';
import Joke from "./Joke";
import { v4 as uuidv4 } from 'uuid';

class  JokeList extends Component {
    static defaultProps = {
        numJokes: 10
    };

    constructor(props) {
        super(props);
        this.state = { 
            jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]"),
            loading: false
        };
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        if(this.state.jokes.length === 0) {
            this.getJokes();
        }
    }

    async getJokes() {
        let jokes = [];
        while(jokes.length < this.props.numJokes) {
            let res = await axios.get("https://icanhazdadjoke.com/", 
                            {
                                headers: { Accept: "application/json"}
                            });
            jokes.push({ 
                jokeText: res.data.joke,
                votes: 0,
                id: uuidv4()
            });
        }
        this.setState(st => ({
            jokes: [...st.jokes, ...jokes],
            loading: false
        }),
        () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
        )
    }

    handleVote(id, updateVote) {
        this.setState(st => ({
            jokes: st.jokes.map(j =>
                j.id === id ? {...j, votes: j.votes + updateVote} : j)
        }),
        () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes)))
    }

    handleClick() {
        this.setState({
            loading:true,
        }, this.getJokes) 
    }

    render() {
        if(this.state.loading) {
            return (
                <div className="JokeList-spinner">
                    <i className="far fa-8x fa-laugh fa-spin" />
                    <h1 className="JokeList-title">Loading...</h1>
                </div>
            );
        }
        return (
            <div className="JokeList">
                <div className="JokeList-sidebar">
                    <h1 className="JokeList-title">
                        <span>Jokes</span>
                    </h1>
                    <img src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg" alt="laughing emoji" />
                    <button className="JokeList-getmore" onClick={this.handleClick} >New Jokes</button>
                </div>
                <div className="JokeList-jokes">
                    {this.state.jokes.map( joke => (
                        <Joke 
                            key={joke.id} 
                            votes={joke.votes} 
                            jokeText={joke.jokeText}
                            upVote={() => this.handleVote(joke.id, 1)}
                            downVote={() => this.handleVote(joke.id, -1)} />
                    ))}
                </div>
            </div>
        )
    }
}

export default JokeList;