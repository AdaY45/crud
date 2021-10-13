import reducer, { usersActions } from "../store/users-slice";

describe("Users-slice", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqual({
      users: [],
      profiles: [],
    });
  });

  it("should handle users being added to an empty list", () => {
    const previousState = { users: [], profiles: [] };
    
    expect(reducer(previousState, usersActions.addUser([]))).toEqual({
      users: [],
      profiles: [],
    });
  });

  it("should handle users being added to an existing list", () => {
    const previousState = {
      users: [
        {
          _id: "615559cf21d8c861693cf3f4",
          username: "admin",
          email: "admin@gmail.com",
          password: "admin1*",
        },
        {
          _id: "615c33299215cb7c1a02f0d4",
          username: "user100",
          email: "user100@gmail.com",
          password: "user100*",
        },
      ],
      profiles: [],
    };

    expect(
      reducer(
        previousState,
        usersActions.addUser({
          _id: "615c33299215cb7c1a02f0d4",
          username: "user100",
          email: "user100@gmail.com",
          password: "user100*",
        })
      )
    ).toEqual({
      users: [
        {
          _id: "615559cf21d8c861693cf3f4",
          username: "admin",
          email: "admin@gmail.com",
          password: "admin1*",
        },
        {
          _id: "615c33299215cb7c1a02f0d4",
          username: "user100",
          email: "user100@gmail.com",
          password: "user100*",
        },
        {
          _id: "615c33299215cb7c1a02f0d4",
          username: "user100",
          email: "user100@gmail.com",
          password: "user100*",
        },
      ],
      profiles: [],
    });
  });

  it("should handle adding users", () => {
    const previousState = { users: [], profiles: [] };
    expect(
      reducer(
        previousState,
        usersActions.addUsers([
          {
            _id: "615559cf21d8c861693cf3f4",
            username: "admin",
            email: "admin@gmail.com",
            password: "admin1*",
          },
          {
            _id: "615c33299215cb7c1a02f0d4",
            username: "user100",
            email: "user100@gmail.com",
            password: "user100*",
          },
          {
            _id: "615c33299215cb7c1a02f0d4",
            username: "user100",
            email: "user100@gmail.com",
            password: "user100*",
          },
        ])
      )
    ).toEqual({
      users: [
        {
          _id: "615559cf21d8c861693cf3f4",
          username: "admin",
          email: "admin@gmail.com",
          password: "admin1*",
        },
        {
          _id: "615c33299215cb7c1a02f0d4",
          username: "user100",
          email: "user100@gmail.com",
          password: "user100*",
        },
        {
          _id: "615c33299215cb7c1a02f0d4",
          username: "user100",
          email: "user100@gmail.com",
          password: "user100*",
        },
      ],
      profiles: [],
    });
  });

  it("should handle adding profiles", () => {
    const previousState = { users: [], profiles: [] };
    expect(
      reducer(
        previousState,
        usersActions.addProfiles([
          {
            _id: "615af658fa576c5c6ce74fb4",
            name: "AdrianaY",
            gender: "female",
            birthdate: 1628726400000,
            city: "Rivne",
            owner: "615af575fa576c5c6ce74fa8",
          },
          {
            _id: "615afcedfa576c5c6ce74fdc",
            name: "Pypok Volodymyr",
            gender: "male",
            birthdate: 1607472000000,
            city: "Kyiv",
            owner: "615af575fa576c5c6ce74fa8",
          },
        ])
      )
    ).toEqual({
      users: [],
      profiles: [
        {
          _id: "615af658fa576c5c6ce74fb4",
          name: "AdrianaY",
          gender: "female",
          birthdate: 1628726400000,
          city: "Rivne",
          owner: "615af575fa576c5c6ce74fa8",
        },
        {
          _id: "615afcedfa576c5c6ce74fdc",
          name: "Pypok Volodymyr",
          gender: "male",
          birthdate: 1607472000000,
          city: "Kyiv",
          owner: "615af575fa576c5c6ce74fa8",
        },
      ],
    });
  });
});
