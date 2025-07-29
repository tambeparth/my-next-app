# Game Sound Effects

This folder contains sound effects used in the travel-themed games:

- `celebration.mp3` - Played when a game is completed
- `card-flip.mp3` - Played when a card is flipped in the memory game
- `match.mp3` - Played when a match is found in the memory game
- `correct.mp3` - Played when a correct answer is given in the quiz game
- `wrong.mp3` - Played when an incorrect answer is given in the quiz game

## Attribution

Please ensure all sound effects used are either:
1. Licensed for commercial use
2. Royalty-free
3. Created specifically for this project

## Usage

Sound effects are loaded using the `use-sound` hook:

```jsx
import useSound from "use-sound";

// Inside your component
const [playSound] = useSound("/sounds/sound-name.mp3", { volume: 0.5 });

// Call playSound() to play the sound
```
