export enum PlayerState{
    IDLE,
    ROLLING,  //start rolling, play roll animation
    ROLL_END,  //get roll result, play walk animation
    WALK_END, //walk to the final land. wait for play's action
}