class FriendsList {
  friends = [];
  addFriend(name) {
    this.friends.push(name);
    this.announceFriendship(name);
  }
  announceFriendship(name) {
    console.log(`Im friend with ${name}`);
  }
  removeFriend(name) {
    const idx = this.friends.indexOf(name);
    if (idx === -1) {
      throw new Error(`No friend with name ${name}`);
    }
    return this.friends.splice(idx, 1);
  }
}

describe.skip('FriendsList', () => {
  let friendsList;
  beforeEach(() => {
    friendsList = new FriendsList();
  });
  it('initializes friends lists', () => {
    expect(friendsList.friends.length).toEqual(0);
  });
  it('Adds one friend to the list', () => {
    friendsList.addFriend('Carlos');
    expect(friendsList.friends.length).toEqual(1);
  });
  it('announces friendship', () => {
    friendsList.announceFriendship = jest.fn();
    expect(friendsList.announceFriendship).not.toHaveBeenCalled();
    friendsList.addFriend('Thomas');
    expect(friendsList.announceFriendship).toHaveBeenCalledTimes(1);
    friendsList.addFriend('Thomas Daniel');
    expect(friendsList.announceFriendship).toHaveBeenCalledWith('Thomas Daniel');
  });

  describe('Remove friend', () => {
    let friendsList;
    beforeEach(() => {
      friendsList = new FriendsList();
    });
    it('removes a friend from array', () => {
      friendsList.addFriend('gory');
      friendsList.addFriend('cddm');
      const newArray = friendsList.removeFriend('gory');
      expect(newArray.length).toEqual(1);
    });
    it('throws error as friend does not exists on the list', () => {
      expect(() => friendsList.removeFriend('Jest')).toThrow();
    });
  });
});
