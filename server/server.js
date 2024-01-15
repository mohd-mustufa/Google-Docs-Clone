const mongoose = require("mongoose");
const Document = require("./models/Document");

// Connecting to the db
const DB_URI =
  "mongodb+srv://admin:admin@simpleblog.gcv6iky.mongodb.net/google-docs-db";
mongoose.connect(DB_URI).then(() => console.log("connected to db"));

// Connect to the client
const io = require("socket.io")(3001, {
  cors: {
    origin: "http;//localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("get-document", async (documentId) => {
    const doc = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", doc.data);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(documentId, { data });
    });
  });
});

async function findOrCreateDocument(id) {
  if (id == null) return;

  const document = await Document.findById(id);
  if (document) return document;
  return await Document.create({ _id: id, data: "" });
}
