export enum PlayerState{
    IDLE,
    ROLLING,  //start rolling, play roll animation
    ROLL_END,  //get roll result, finish roll animation
    WALKING, // walking to the destination
    WALK_END, //walk to the final land. wait for play's action
}