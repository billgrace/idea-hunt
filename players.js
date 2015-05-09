/* players.js
 *
 * @author billgrace / http://billgrace.com
 *
 */

/*
 * player creation and mainenance
 * routines to allow a player to create his/her custom self for game playing
 *
 * - view all players and select one for a game
 * - create a new player, delete (de-activate) a player, edit a player
 */

/*
 * an IndexedDb object store for player information is named "ideahunt.players"
 * each player has:
 *  a text name
 *  a choice of self image:
 *   - one of several stock JPG images built into the game
 *   - or "custom" with a player-supplied JPG image
 *  self image is a JPG 150 pixels wide, 225 pixels high
 */
