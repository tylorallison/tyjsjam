# tyjsjam - A very, very basic javascript game framework highlighting use of json driven sprite and level management.

## Goal

The goal here is to simply be able to show off how I plan to use sprites and levels in a javascript game framework.  I'm using this as a building block for other games, maybe you an as well.  Check out my level editor that plugs into this: [tyte](https://github.com/tylorallison/tyte).  A Unity3D project built to create and edit the level/zone files for a project such as this.

## Usage

This js framework uses modules, so if you try to just point your browser at the game folder directly, it likely won't work.  I use a python oneliner to start a simple server, then connect to my localhost port.

```
python3 -m http.server 8000
```

Once running, you can use the arrow keys to move your little dragon.

## Acknowledgements

Top-down tileset is by `Matiaan` from [OpenGameArt.Org](https://opengameart.org/content/top-down-grass-beach-and-water-tileset).
Dragon tile is used by permission and is by Austin Blackwood [@AABlackwood](https://twitter.com/AABlackwood).