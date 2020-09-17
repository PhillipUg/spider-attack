/*eslint-disable */
import LeaderBoard from '../src/modules/leaderboard';

jest.mock('../src/modules/leaderboard');

describe('Testing out the leaderboard API endpoints', () => {
  const board = new LeaderBoard();

  it('shows the scores returned', async () => {
    board.getBoard.mockResolvedValue({
      result: [
        {
          user: 'mike',
          score: '1200',
        },
        {
          user: 'flint',
          score: '350',
        },
        {
          user: 'same',
          score: '35',
        },
      ],
    });

    const recievedScore = await board.getBoard();
    expect(recievedScore).toEqual({
      result: [
        {
          user: 'mike',
          score: '1200',
        },
        {
          user: 'flint',
          score: '350',
        },
        {
          user: 'same',
          score: '35',
        },
      ],
    });
  });
  it('returns empty array if no score', async () => {
    board.getBoard.mockResolvedValue({ result: [] });
    const recievedScore = await board.getBoard();

    expect(recievedScore).toEqual({ result: [] });
  });

});
/*eslint-enable */
