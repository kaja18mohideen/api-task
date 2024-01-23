const express = require('express');
const app = express();
const port = 3002;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

let rooms = [];
let bookings = [];
let customers = [];

app.post('/rooms', (req, res) => {
  const { seats, amenities, pricePerHour } = req.body;
  const room = {
    id: rooms.length + 1,
    seats,
    amenities,
    pricePerHour,
  };
  rooms.push(room);
  res.json(room);
});

app.post('/bookings', (req, res) => {
  const { customerName, date, startTime, endTime, roomId } = req.body;
  const room = rooms.find((r) => r.id === roomId);

  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  const booking = {
    id: bookings.length + 1,
    customerName,
    date,
    startTime,
    endTime,
    roomId,
  };
  bookings.push(booking);
  res.json(booking);
});

app.get('/rooms/bookings', (req, res) => {
  const result = rooms.map((room) => {
    const booking = bookings.find((b) => b.roomId === room.id);
    return {
      roomName: `Room ${room.id}`,
      bookedStatus: booking ? 'Booked' : 'Available',
      customerName: booking ? booking.customerName : null,
      date: booking ? booking.date : null,
      startTime: booking ? booking.startTime : null,
      endTime: booking ? booking.endTime : null,
    };
  });
  res.json(result);
});

app.get('/customers/bookings', (req, res) => {
  const result = bookings.map((booking) => {
    const room = rooms.find((r) => r.id === booking.roomId);
    return {
      customerName: booking.customerName,
      roomName: `Room ${booking.roomId}`,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
    };
  });
  res.json(result);
});

app.get('/customer/bookings/:customerName', (req, res) => {
  const customerName = req.params.customerName;
  const result = bookings.filter((booking) => booking.customerName === customerName);
  res.json(result);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
