Projekt zaliczeniowy z przedmiotu "Tworzenie aplikacji dla środowisk chmurowych".
Aplikacja "notatnik w chmurze".
Baza danych MySQL - czysta baza  podnosi się (z inicjacją) około 6 minut. dopiero wtedy zadziała docker myapi i funkcje frontendu.
API do obsługi bazy FastAPI w python, połączenie z db sqlalchemy (Swagger dostępny na http://localhost:8555/docs ). docker my-api uruchamiany z opcją restart: unless-stopped ze względu na czas startu i inicjalizacji mysql. 
Frontent - javascript, React, podstawa frontend wygenerowana z Vite. 

aplikacja pozwala na tworzenie i proste logowanie użytkownika
następnie odczyt istniejących i tworzenie nowych własnych notatek. 
