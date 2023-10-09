import React, { Component } from 'react';
import { Game, Component as SnakeComponent } from './Snake';
import { FullGlowButton } from 'components/Buttons';
import { Center, Text, useColorModeValue } from '@chakra-ui/react';

interface SnakeGameState {
  gameEnded: boolean;
  snake: any;
  gameInterval: any;
  gameStarted: boolean; // Add a flag to track whether the game has started
}

class SnakeGame extends Component<{}, SnakeGameState> {
  canvas: HTMLCanvasElement | null = null;

  constructor(props: {}) {
    super(props);

    this.state = {
      gameEnded: false,
      snake: null,
      gameInterval: null,
      gameStarted: false, // Initialize gameStarted as false
    };
  }

  initializeGame() {
    this.clearCanvas();
    this.canvas = document.getElementById('stage') as HTMLCanvasElement;

    if (this.canvas) {
      const context = this.canvas.getContext('2d');
      if (context) {
        const snake = new SnakeComponent.Snake(this.canvas, { fps: 80, size: 3 });
        const handleGameEnd = (isGameEnded: any) => {
          this.setState({ gameEnded: isGameEnded });
          this.clearGameInterval();
          this.clearCanvas();
        };

        const gameDraw = new Game.Draw(context, snake, handleGameEnd);

        const gameInterval = setInterval(() => {
          if (!this.state.gameEnded) {
            gameDraw.drawStage();
          }
        }, snake.stage.conf.fps);

        this.setState({ snake, gameInterval, gameStarted: true }); // Update gameStarted
      }
    }
  }

  restartGame() {
    const { snake } = this.state;
    if (snake) {
      snake.restart();
      this.setState({ gameEnded: false }, () => {
        this.clearCanvas();
        this.initializeGame();
      });
    }
  }

  clearCanvas() {
    if (this.canvas) {
      const context = this.canvas.getContext('2d');
      if (context) {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  }

  clearGameInterval() {
    const { gameInterval } = this.state;
    if (gameInterval) {
      clearInterval(gameInterval);
    }
  }

  render() {
    const { gameEnded, gameStarted } = this.state;
    return (
        <>
        {!gameStarted && (
          <Center><FullGlowButton text='Start!' onClick={() => this.initializeGame()} /></Center>
        )}
        <Center>
            {gameEnded ? (
            <div>
                <Text textColor={'white'} mb={4} fontWeight="semibold">Game Over!</Text>
                <FullGlowButton text='Restart!' onClick={() => this.restartGame()} />
            </div>
            ) : (
            <canvas id="stage" width={400} height={400}></canvas>
            )}
      </Center>
      </>
    );
  }
}

export default SnakeGame;
