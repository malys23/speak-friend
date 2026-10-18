CREATE SCHEMA IF NOT EXISTS speak_friend_app;
SET search_path TO speak_friend_app;
CREATE TABLE IF NOT EXISTS users (
    user_id       SERIAL PRIMARY KEY,
    username      VARCHAR(100) NOT NULL UNIQUE,
    email         VARCHAR(100) NOT NULL UNIQUE,
    dob           DATE,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_login    TIMESTAMPTZ,
    is_active     BOOLEAN DEFAULT TRUE,
    avatar_url    VARCHAR(300)
);

CREATE TABLE IF NOT EXISTS friends (
    friend_id  SERIAL PRIMARY KEY,
    user_id_1  INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    user_id_2  INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    status     VARCHAR(20) NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'accepted', 'blocked')),
    requested_by INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_friendship UNIQUE (user_id_1, user_id_2),
    CONSTRAINT ordered_friendship CHECK (user_id_1 < user_id_2),
    CONSTRAINT requester_in_pair CHECK (requested_by IN (user_id_1, user_id_2))
);

CREATE TABLE IF NOT EXISTS private_messages (
    message_id  SERIAL PRIMARY KEY,
    sender_id   INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    receiver_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    content     TEXT NOT NULL,
    sent_at     TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    is_read     BOOLEAN DEFAULT FALSE,
    edited_at   TIMESTAMPTZ,
    is_deleted  BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS private_message_attachments (
    attachment_id SERIAL PRIMARY KEY,
    message_id    INT NOT NULL REFERENCES private_messages(message_id) ON DELETE CASCADE,
    file_url      VARCHAR(500) NOT NULL,
    file_type     VARCHAR(50) NOT NULL,
    uploaded_by   INT REFERENCES users(user_id) ON DELETE SET NULL,
    created_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS private_message_reactions (
    reaction_id SERIAL PRIMARY KEY,
    message_id  INT NOT NULL REFERENCES private_messages(message_id) ON DELETE CASCADE,
    user_id     INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    emoji       VARCHAR(10) NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    -- Prevent the same user reacting with the same emoji twice
    CONSTRAINT unique_private_reaction UNIQUE (message_id, user_id, emoji)
);

CREATE TABLE IF NOT EXISTS groups (
    group_id    SERIAL PRIMARY KEY,
    group_name  VARCHAR(100) NOT NULL,
    created_by  INT REFERENCES users(user_id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    avatar_url  VARCHAR(300),
    is_active   BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS group_memberships (
    member_id  SERIAL PRIMARY KEY,
    group_id   INT NOT NULL REFERENCES groups(group_id) ON DELETE CASCADE,
    user_id    INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    role       VARCHAR(20) NOT NULL DEFAULT 'member'
                   CHECK (role IN ('member', 'admin')),
    joined_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    left_at    TIMESTAMPTZ,

    CONSTRAINT unique_group_member UNIQUE (group_id, user_id)
);

CREATE TABLE IF NOT EXISTS group_messages (
    group_message_id SERIAL PRIMARY KEY,
    group_id         INT NOT NULL REFERENCES groups(group_id) ON DELETE CASCADE,
    sender_id        INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    content          TEXT NOT NULL,
    sent_at          TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    is_deleted       BOOLEAN DEFAULT FALSE,
    edited_at        TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS group_message_attachments (
    attachment_id SERIAL PRIMARY KEY,
    message_id    INT NOT NULL REFERENCES group_messages(group_message_id) ON DELETE CASCADE,
    file_url      VARCHAR(500) NOT NULL,
    file_type     VARCHAR(50) NOT NULL,
    uploaded_by   INT REFERENCES users(user_id) ON DELETE SET NULL,
    created_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS group_message_reactions (
    reaction_id SERIAL PRIMARY KEY,
    message_id  INT NOT NULL REFERENCES group_messages(group_message_id) ON DELETE CASCADE,
    user_id     INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    emoji       VARCHAR(10) NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_group_reaction UNIQUE (message_id, user_id, emoji)
);

CREATE TABLE IF NOT EXISTS campaigns (
    campaign_id   SERIAL PRIMARY KEY,
    campaign_name VARCHAR(100) NOT NULL,
    group_id      INT NOT NULL REFERENCES groups(group_id) ON DELETE CASCADE,
    created_by    INT REFERENCES users(user_id) ON DELETE SET NULL,
    description   TEXT,
    created_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS campaign_participants (
    campaign_participant_id SERIAL PRIMARY KEY,
    campaign_id             INT NOT NULL REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
    user_id                 INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    role                    VARCHAR(20) NOT NULL DEFAULT 'player'
                                CHECK (role IN ('player', 'dm')),
    joined_at               TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    is_active               BOOLEAN DEFAULT TRUE,

    CONSTRAINT unique_campaign_participant UNIQUE (campaign_id, user_id)
);

CREATE TABLE IF NOT EXISTS campaign_messages (
    campaign_message_id SERIAL PRIMARY KEY,
    campaign_id         INT NOT NULL REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
    sender_id           INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    content             TEXT NOT NULL,
    sent_at             TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    is_deleted          BOOLEAN DEFAULT FALSE,
    edited_at           TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS campaign_message_attachments (
    attachment_id SERIAL PRIMARY KEY,
    message_id    INT NOT NULL REFERENCES campaign_messages(campaign_message_id) ON DELETE CASCADE,
    file_url      VARCHAR(500) NOT NULL,
    file_type     VARCHAR(50) NOT NULL,
    uploaded_by   INT REFERENCES users(user_id) ON DELETE SET NULL,
    created_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS campaign_message_reactions (
    reaction_id SERIAL PRIMARY KEY,
    message_id  INT NOT NULL REFERENCES campaign_messages(campaign_message_id) ON DELETE CASCADE,
    user_id     INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    emoji       VARCHAR(10) NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_campaign_reaction UNIQUE (message_id, user_id, emoji)
);

CREATE TABLE IF NOT EXISTS call_sessions (
    call_id      SERIAL PRIMARY KEY,
    call_type    VARCHAR(10) NOT NULL CHECK (call_type IN ('voice', 'video')),
    initiator_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    receiver_id  INT REFERENCES users(user_id) ON DELETE SET NULL,
    group_id     INT REFERENCES groups(group_id) ON DELETE SET NULL,
    start_time   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    end_time     TIMESTAMPTZ,
    status       VARCHAR(20) NOT NULL DEFAULT 'started'
                     CHECK (status IN ('started', 'ended', 'missed')),

    CHECK (receiver_id IS NOT NULL OR group_id IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS call_participants (
    call_participant_id SERIAL PRIMARY KEY,
    call_id             INT NOT NULL REFERENCES call_sessions(call_id) ON DELETE CASCADE,
    user_id             INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    join_time           TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    leave_time          TIMESTAMPTZ,

    CONSTRAINT unique_call_participant UNIQUE (call_id, user_id)
);

CREATE TABLE IF NOT EXISTS campaign_notes (
    note_id     SERIAL PRIMARY KEY,
    campaign_id INT NOT NULL REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
    author_id   INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title       VARCHAR(200) NOT NULL,
    content     TEXT,
    created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    visibility  VARCHAR(10) NOT NULL DEFAULT 'private'
                    CHECK (visibility IN ('public', 'private'))
);

CREATE TABLE IF NOT EXISTS campaign_maps (
    map_id           SERIAL PRIMARY KEY,
    campaign_id      INT NOT NULL REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
    name             VARCHAR(100) NOT NULL,
    image_url        VARCHAR(500),
    uploaded_by      INT REFERENCES users(user_id) ON DELETE SET NULL,
    created_at       TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    visibility       VARCHAR(10) NOT NULL DEFAULT 'private'
                         CHECK (visibility IN ('public', 'private')),
    width            INT,
    height           INT,
    grid_size        INT DEFAULT 50,
    grid_enabled     BOOLEAN DEFAULT TRUE,
    background_color VARCHAR(7) DEFAULT '#000000',
    is_locked        BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS map_tokens (
    token_id   SERIAL PRIMARY KEY,
    map_id     INT NOT NULL REFERENCES campaign_maps(map_id) ON DELETE CASCADE,
    placed_by  INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    image_url  VARCHAR(500),
    label      VARCHAR(100),
    position_x DECIMAL(10, 2) NOT NULL DEFAULT 0,
    position_y DECIMAL(10, 2) NOT NULL DEFAULT 0,
    width      DECIMAL(10, 2) NOT NULL DEFAULT 50,
    height     DECIMAL(10, 2) NOT NULL DEFAULT 50,
    rotation   DECIMAL(6, 2) NOT NULL DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS map_annotations (
    annotation_id SERIAL PRIMARY KEY,
    map_id        INT NOT NULL REFERENCES campaign_maps(map_id) ON DELETE CASCADE,
    created_by    INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    type          VARCHAR(20) NOT NULL CHECK (type IN ('drawing', 'text', 'shape')),
    data          JSONB NOT NULL,
    color         VARCHAR(7) DEFAULT '#ffffff',
    is_visible    BOOLEAN DEFAULT TRUE,
    created_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS campaign_files (
    file_id     SERIAL PRIMARY KEY,
    campaign_id INT NOT NULL REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
    file_name   VARCHAR(200) NOT NULL,
    file_type   VARCHAR(50) NOT NULL,
    file_url    VARCHAR(500) NOT NULL,
    uploaded_by INT REFERENCES users(user_id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    visibility  VARCHAR(10) NOT NULL DEFAULT 'private'
                    CHECK (visibility IN ('public', 'private'))
);

CREATE TABLE IF NOT EXISTS live_sessions (
    session_id    SERIAL PRIMARY KEY,
    campaign_id   INT NOT NULL REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
    dm_user_id    INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    start_time    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    end_time      TIMESTAMPTZ,
    is_active     BOOLEAN DEFAULT TRUE,
    session_notes TEXT
);

CREATE TABLE IF NOT EXISTS live_session_maps (
    session_map_id SERIAL PRIMARY KEY,
    session_id     INT NOT NULL REFERENCES live_sessions(session_id) ON DELETE CASCADE,
    map_id         INT NOT NULL REFERENCES campaign_maps(map_id) ON DELETE CASCADE,
    is_active      BOOLEAN DEFAULT FALSE,
    map_order      INT NOT NULL DEFAULT 0,
    added_at       TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_session_map UNIQUE (session_id, map_id)
);

CREATE INDEX IF NOT EXISTS idx_pm_conversation
    ON private_messages (sender_id, receiver_id, sent_at DESC);

CREATE INDEX IF NOT EXISTS idx_pm_receiver_unread
    ON private_messages (receiver_id) WHERE is_read = FALSE;

CREATE INDEX IF NOT EXISTS idx_group_msgs
    ON group_messages (group_id, sent_at DESC);

CREATE INDEX IF NOT EXISTS idx_campaign_msgs
    ON campaign_messages (campaign_id, sent_at DESC);