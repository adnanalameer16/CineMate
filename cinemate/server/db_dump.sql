--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-07-06 16:10:11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4901 (class 1262 OID 24643)
-- Name: cinemate; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE cinemate WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_India.1252';


ALTER DATABASE cinemate OWNER TO postgres;

\connect cinemate

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 24645)
-- Name: user_movie_actions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_movie_actions (
    id integer NOT NULL,
    uid text NOT NULL,
    tmdb_id integer NOT NULL,
    title text,
    poster text,
    cast_list text,
    director text,
    genre text,
    action text NOT NULL,
    "timestamp" timestamp without time zone DEFAULT now(),
    CONSTRAINT user_movie_actions_action_check CHECK ((action = ANY (ARRAY['liked'::text, 'disliked'::text, 'watchlist'::text])))
);


ALTER TABLE public.user_movie_actions OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 24644)
-- Name: user_movie_actions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_movie_actions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_movie_actions_id_seq OWNER TO postgres;

--
-- TOC entry 4902 (class 0 OID 0)
-- Dependencies: 217
-- Name: user_movie_actions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_movie_actions_id_seq OWNED BY public.user_movie_actions.id;


--
-- TOC entry 4742 (class 2604 OID 24648)
-- Name: user_movie_actions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_movie_actions ALTER COLUMN id SET DEFAULT nextval('public.user_movie_actions_id_seq'::regclass);


--
-- TOC entry 4895 (class 0 OID 24645)
-- Dependencies: 218
-- Data for Name: user_movie_actions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_movie_actions (id, uid, tmdb_id, title, poster, cast_list, director, genre, action, "timestamp") FROM stdin;
1	W1F7YTMYAjYsodHz9ZqMGxcowt52	1100988	28 Years Later	https://image.tmdb.org/t/p/w500/wnHUip9oKvDJEJUEk62L4rFSYGa.jpg	Alfie Williams, Jodie Comer, Aaron Taylor-Johnson, Ralph Fiennes, Edvin Ryding	Danny Boyle	Horror, Thriller, Science Fiction	liked	2025-07-06 14:31:40.52156
2	W1F7YTMYAjYsodHz9ZqMGxcowt52	547016	The Old Guard	https://image.tmdb.org/t/p/w500/cjr4NWURcVN3gW5FlHeabgBHLrY.jpg	Charlize Theron, KiKi Layne, Veronica Ngo, Matthias Schoenaerts, Marwan Kenzari	Gina Prince-Bythewood	Action, Fantasy	watchlist	2025-07-06 14:33:41.172719
\.


--
-- TOC entry 4903 (class 0 OID 0)
-- Dependencies: 217
-- Name: user_movie_actions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_movie_actions_id_seq', 2, true);


--
-- TOC entry 4746 (class 2606 OID 24654)
-- Name: user_movie_actions user_movie_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_movie_actions
    ADD CONSTRAINT user_movie_actions_pkey PRIMARY KEY (id);


--
-- TOC entry 4748 (class 2606 OID 24656)
-- Name: user_movie_actions user_movie_actions_uid_tmdb_id_action_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_movie_actions
    ADD CONSTRAINT user_movie_actions_uid_tmdb_id_action_key UNIQUE (uid, tmdb_id, action);


-- Completed on 2025-07-06 16:10:11

--
-- PostgreSQL database dump complete
--

