# SpeakFriend
Chat application for fantasy and DND enthusiasts

psql -U postgres -d speakfriend -v ON_ERROR_STOP=1 -f backend/src/db/migrations/001_initial_schema.sql