import request from "supertest";
import { describe, it, expect, beforeEach } from "vitest";
import { app } from "../server.js";
import { Boulder } from "../models/Boulder.js";
import { User } from "../models/User.js";

describe("Boulder API - Create", () => {
  let standardToken: string;
  let vScaleToken: string;

  beforeEach(async () => {
    // skapar Font-användare
    const fontUser = { email: "font-user@test.com", password: "password123" };
    await request(app).post("/api/auth/register").send(fontUser);
    const resFont = await request(app).post("/api/auth/login").send(fontUser);
    standardToken = resFont.body.token;

    // skapar V-Scale-användare
    const vScaleUser = {
      email: "vscale-user@test.com",
      password: "password123",
    };
    await request(app).post("/api/auth/register").send(vScaleUser);
    const resVScale = await request(app)
      .post("/api/auth/login")
      .send(vScaleUser);
    vScaleToken = resVScale.body.token;

    await request(app)
      .put("/api/user/settings")
      .set("Authorization", `Bearer ${vScaleToken}`)
      .send({ gradingSystem: "v-scale" });
  });

  it("should save grade as Font even if user sends V-Scale (V6 => 7A)", async () => {
    await User.findOneAndUpdate(
      { email: "vscale-user@test.com" },
      { gradingSystem: "v-scale" }
    );

    const newBoulder = {
      name: "test V-Scale Boulder",
      grade: "V6",
      description: "Mountain",
      coordinates: {
        lat: 57.7089,
        lng: 11.9746,
      },
    };
    const response = await request(app)
      .post("/api/boulders")
      .set("Authorization", `Bearer ${vScaleToken}`)
      .send(newBoulder);

    expect(response.status).toBe(201);
    expect(response.body.data.grade).toBe("7A");
    expect(response.body.data.location.lat).toBe(57.7089);

    const boulderInDb = await Boulder.findOne({ name: "test V-Scale Boulder" });
    expect(boulderInDb?.grade).toBe("7A");
  });

  it("should return 401 if trying to create without token", async () => {
    const response = await request(app).post("/api/boulders").send({
      name: "Unauthorized Boulder",
      grade: "7A",
      description: "Should not be created",
    });
    expect(response.status).toBe(401);
  });

  it("should save complete boulder with image, coordinates and topo data", async () => {
    const completeBoulder = {
      name: "The Highball",
      grade: "6C+",
      description: "A challenging highball boulder problem.",
      coordinates: {
        lat: 59.3293,
        lng: 18.0683,
      },
      imagesUrl: "http://example.com/highball.jpg",
      topoData: {
        linePoints: [
          { x: 10, y: 20 },
          { x: 30, y: 40 },
        ],
        holds: [
          { type: "start", position: { x: 10, y: 20 } },
          { type: "finish", position: { x: 30, y: 40 } },
          { type: "hand", position: { x: 12, y: 25 } },
          { type: "foot", position: { x: 15, y: 30 } },
        ],
      },
    };

    const response = await request(app)
      .post("/api/boulders")
      .set("Authorization", `Bearer ${standardToken}`)
      .send(completeBoulder);

    expect(response.status).toBe(201);
    expect(response.body.data.location.lat).toBe(59.3293);
    expect(response.body.data.topoData.holds[0].type).toBe("start");

    const boulderInDb = await Boulder.findOne({ name: "The Highball" });
    expect(boulderInDb?.topoData?.linePoints).toHaveLength(2);
  });
});

describe("Boulder API - Get All", () => {
  let vScaleToken: string;
  let currentUserId: string;

  beforeEach(async () => {
    // Setup för en specifik användare som gillar V-Scale
    const user = { email: "get-test@test.com", password: "password123" };
    await request(app).post("/api/auth/register").send(user);
    const login = await request(app).post("/api/auth/login").send(user);
    vScaleToken = login.body.token;

    const userInDb = await User.findOneAndUpdate(
      { email: user.email },
      { gradingSystem: "v-scale" },
      { new: true }
    );

    currentUserId = userInDb!._id.toString();
  });

  it("should get all boulders and convert grades to V-scale if user preference is set", async () => {
    // Skapa en boulder som ligger i databasen som Font (7A)
    const testBoulder = new Boulder({
      name: "GET Test Boulder",
      grade: "7A",
      location: { lat: 58.0, lng: 15.0 },
      author: currentUserId,
      topoData: { linePoints: [], holds: [] },
    });
    await testBoulder.save();

    const response = await request(app)
      .get("/api/boulders")
      .set("Authorization", `Bearer ${vScaleToken}`);

    expect(response.status).toBe(200);

    // Verifiera att graden konverterats i svaret
    const found = response.body.data.find(
      (b: any) => b.name === "GET Test Boulder"
    );
    expect(found).toBeDefined();
    expect(found.grade).toBe("V6"); // 7A i DB ska bli V6 i API-svaret
  });
});
