/* AHLTV: переключатель языка RU / EN / DE.
   Подключается одной строкой в index.html (после awards.js, перед </body>):
   <script src="i18n.js"></script>
   Оригинал сайта остаётся на русском, переводы берутся из словаря ниже. */
(function(){
  if(window.__ahI18n)return;window.__ahI18n=true;
  var LANGS=["ru","en","de"],IDX={en:0,de:1},lang="ru";
  try{var sv=localStorage.getItem("ah_lang");if(LANGS.indexOf(sv)>-1)lang=sv}catch(e){}
  var has=Object.prototype.hasOwnProperty;

  /* ---------- словарь: "русский текст": [English, Deutsch] ---------- */
  var WHY="Почта нужна, чтобы создать ваш аккаунт и входить в него, подтвердить, что это вы (мы отправляем письмо со ссылкой), восстановить пароль и связаться с вами по турниру. Почту видят организатор и админы турнира, данные хранятся в сервисе Google Firebase. Чтобы удалить свои данные, напишите организатору в разделе «Связаться».";
  var D={
    /* навигация */
    "Главная":["Home","Start"],
    "Топ":["Top","Top"],
    "Турниры":["Tournaments","Turniere"],
    "Формат":["Format","Format"],
    "Сетка":["Bracket","Turnierbaum"],
    "Правила":["Rules","Regeln"],
    "Админка":["Admin","Admin"],
    "Аккаунт":["Account","Konto"],
    "Аккаунт ▾":["Account ▾","Konto ▾"],
    "Регистрация":["Sign up","Registrierung"],
    "Профиль":["Profile","Profil"],
    "Открыть меню":["Open menu","Menü öffnen"],
    "Закрыть меню":["Close menu","Menü schließen"],
    "Меню":["Menu","Menü"],
    "Разделы сайта":["Site sections","Seitenbereiche"],
    "Язык":["Language","Sprache"],

    /* главная */
    "Два режима: дуэли 1×1 и пары 2×2. Играем сразу на выбывание: проиграл — вылетел. Финал играется до трёх выигранных карт.":["Two modes: 1×1 duels and 2×2 pairs. Straight single elimination: lose and you're out. The final is first to three maps.","Zwei Modi: 1×1-Duelle und 2×2-Paare. Direkt K.-o.-System: Wer verliert, scheidet aus. Das Finale geht bis zu drei gewonnenen Karten."],
    "Зарегистрироваться на турнир":["Register for the tournament","Zum Turnier anmelden"],
    "Связаться":["Contact","Kontakt"],
    "До старта турнира":["Until the tournament starts","Bis zum Turnierstart"],
    "ДНИ":["DAYS","TAGE"],"ЧАСЫ":["HOURS","STD"],"МИН":["MIN","MIN"],"СЕК":["SEC","SEK"],
    "Режимы":["Modes","Modi"],
    "1×1 и 2×2":["1×1 and 2×2","1×1 und 2×2"],
    "Слоты":["Slots","Plätze"],
    "16 в каждом режиме":["16 in each mode","16 pro Modus"],
    "Допуск":["Admission","Zulassung"],
    "По заявке":["By application","Auf Antrag"],
    "Финал":["Final","Finale"],
    "До 3 карт":["First to 3 maps","Bis 3 Karten"],
    "Скоро будут новые":["New ones coming soon","Bald gibt es neue"],
    "Новые турниры появятся здесь.":["New tournaments will appear here.","Neue Turniere erscheinen hier."],

    /* сетка */
    "1/8 финала":["Round of 16","Achtelfinale"],
    "1/4 финала":["Quarter-finals","Viertelfinale"],
    "Полуфинал":["Semi-finals","Halbfinale"],
    "+ внести счёт":["+ enter score","+ Ergebnis eintragen"],

    /* правила */
    "Участие":["Participation","Teilnahme"],
    "Матчи":["Matches","Matches"],
    "Честная игра":["Fair play","Fairplay"],
    "Споры":["Disputes","Streitfälle"],
    "Турнир открытый: два режима, 1×1 и 2×2, по 16 слотов в каждом.":["Open tournament: two modes, 1×1 and 2×2, with 16 slots in each.","Offenes Turnier: zwei Modi, 1×1 und 2×2, mit je 16 Plätzen."],
    "Допуск: заявки подтверждает организатор. В заявке нужны игровой ник и ссылка на профиль Steam.":["Admission: applications are confirmed by the organizer. An application needs an in-game nickname and a link to your Steam profile.","Zulassung: Anmeldungen werden vom Veranstalter bestätigt. Erforderlich sind ein Spielname und ein Link zum Steam-Profil."],
    "Один игрок — один аккаунт. Играть с чужого или запасного аккаунта нельзя.":["One player — one account. Playing from someone else's or a spare account is not allowed.","Ein Spieler — ein Konto. Mit fremden oder Zweitkonten zu spielen ist verboten."],
    "Заявки принимаются по порядку подачи, пока есть свободные слоты. Организаторы подтверждают каждую заявку.":["Applications are accepted in order of submission while slots are available. Organizers confirm each application.","Anmeldungen werden in der Reihenfolge des Eingangs angenommen, solange Plätze frei sind. Die Veranstalter bestätigen jede Anmeldung."],
    "В режиме 2×2 состав из двух игроков фиксируется в заявке. После начала турнира заменить игрока нельзя.":["In 2×2 mode the team of two players is set in the application. Players cannot be replaced once the tournament has started.","Im 2×2-Modus wird das Team aus zwei Spielern in der Anmeldung festgelegt. Nach Turnierbeginn kann kein Spieler ersetzt werden."],
    "Все матчи играются по сетке на выбывание: проигравший сразу выбывает.":["All matches are played in a single-elimination bracket: the loser is out immediately.","Alle Matches werden im K.-o.-System gespielt: Der Verlierer scheidet sofort aus."],
    "Матчи играются до двух выигранных карт, финал до трёх.":["Matches are first to two maps, the final is first to three.","Matches gehen bis zu zwei gewonnenen Karten, das Finale bis zu drei."],
    "Жеребьёвка сетки проходит перед стартом, результат публикуется на сайте.":["The bracket draw takes place before the start and the result is published on the site.","Die Auslosung findet vor dem Start statt, das Ergebnis wird auf der Seite veröffentlicht."],
    "Карты выбираются бан-пиком. Пул карт объявляется перед стартом турнира.":["Maps are chosen via ban/pick. The map pool is announced before the tournament starts.","Die Karten werden per Ban/Pick gewählt. Der Map-Pool wird vor Turnierstart bekanntgegeben."],
    "Стороны на карте определяются по итогам бан-пика.":["Sides on each map are decided by the ban/pick result.","Die Seiten auf der Karte ergeben sich aus dem Ban/Pick."],
    "Будьте в Discord за 10 минут до своего матча.":["Be on Discord 10 minutes before your match.","Sei 10 Minuten vor deinem Match auf Discord."],
    "Если соперник не пришёл через 10 минут после назначенного времени, засчитывается техническая победа.":["If your opponent does not show up within 10 minutes of the scheduled time, a technical win is awarded.","Erscheint der Gegner 10 Minuten nach der angesetzten Zeit nicht, wird ein technischer Sieg gewertet."],
    "На матч даётся до двух пауз по две минуты каждой стороне. Если у игрока оборвалась связь, ждём его не больше пяти минут.":["Each side gets up to two pauses of two minutes per match. If a player loses connection, we wait for no more than five minutes.","Pro Match stehen jeder Seite bis zu zwei Pausen à zwei Minuten zu. Bei Verbindungsabbruch warten wir höchstens fünf Minuten."],
    "Результат фиксирует организатор по скриншоту итоговой таблицы или по записи демо.":["The organizer records the result from a screenshot of the final scoreboard or from the demo.","Das Ergebnis wird vom Veranstalter anhand eines Screenshots der Endtabelle oder der Demo festgehalten."],
    "Читы, скрипты, макросы и любые программы, дающие преимущество, запрещены.":["Cheats, scripts, macros and any software that gives an advantage are forbidden.","Cheats, Skripte, Makros und jede Software, die einen Vorteil verschafft, sind verboten."],
    "Использовать баги карты и игры нельзя.":["Exploiting map or game bugs is not allowed.","Das Ausnutzen von Karten- oder Spielfehlern ist nicht erlaubt."],
    "Нельзя смотреть чужую трансляцию и получать подсказки от зрителей во время матча.":["You may not watch someone else's stream or receive tips from spectators during a match.","Fremde Streams anzusehen oder während des Matches Hinweise von Zuschauern zu erhalten ist verboten."],
    "За оскорбления и угрозы в чате или голосе выдаётся предупреждение, при повторе игрок дисквалифицируется.":["Insults and threats in chat or voice result in a warning; repeat offenders are disqualified.","Für Beleidigungen und Drohungen im Chat oder Voice gibt es eine Verwarnung, bei Wiederholung die Disqualifikation."],
    "Организаторы могут запросить демо и проверить матч. Нарушителя дисквалифицируют, а результаты его матчей аннулируют.":["Organizers may request the demo and review a match. Offenders are disqualified and the results of their matches are voided.","Die Veranstalter können die Demo anfordern und das Match prüfen. Regelverstöße führen zur Disqualifikation, die Ergebnisse der Matches werden annulliert."],
    "Если что-то пошло не так, сразу после матча напишите организаторам в Telegram или Discord и приложите скриншоты.":["If something goes wrong, message the organizers on Telegram or Discord right after the match and attach screenshots.","Wenn etwas schiefgeht, schreibe den Veranstaltern direkt nach dem Match auf Telegram oder Discord und hänge Screenshots an."],
    "Решение организаторов окончательное. Об изменениях в правилах сообщим в Discord до начала турнира.":["The organizers' decision is final. Rule changes will be announced on Discord before the tournament starts.","Die Entscheidung der Veranstalter ist endgültig. Regeländerungen geben wir vor Turnierbeginn auf Discord bekannt."],

    /* заявка */
    "Заявка":["Application","Anmeldung"],
    "Регистрация на турнир":["Tournament registration","Turnieranmeldung"],
    "Ник":["Nickname","Nickname"],
    "Ник напарника":["Teammate's nickname","Nickname des Partners"],
    "Почта":["Email","E-Mail"],
    "Зачем мы просим почту?":["Why do we ask for your email?","Warum fragen wir nach deiner E-Mail?"],
    "Пароль для аккаунта (от 6 символов)":["Account password (6+ characters)","Passwort für das Konto (ab 6 Zeichen)"],
    "Профиль Steam (ссылка)":["Steam profile (link)","Steam-Profil (Link)"],
    "Отправить заявку":["Submit application","Anmeldung senden"],
    "Заявка отправлена":["Application sent","Anmeldung gesendet"],
    "Статус заявки виден в вашем аккаунте. Чтобы ускорить, можно продублировать её организатору в Telegram.":["The status of your application is shown in your account. To speed things up, you can also send it to the organizer on Telegram.","Der Status deiner Anmeldung ist in deinem Konto sichtbar. Zur Beschleunigung kannst du sie dem Veranstalter zusätzlich per Telegram schicken."],
    "Скопировать и открыть Telegram":["Copy and open Telegram","Kopieren und Telegram öffnen"],
    "Заполните все поля, почта должна быть настоящей.":["Fill in all fields; the email must be real.","Fülle alle Felder aus; die E-Mail muss echt sein."],
    "Вставьте ссылку на профиль Steam (steamcommunity.com/...).":["Paste a link to your Steam profile (steamcommunity.com/...).","Füge den Link zu deinem Steam-Profil ein (steamcommunity.com/...)."],
    "Придумайте пароль от 6 символов для аккаунта.":["Choose an account password of at least 6 characters.","Wähle ein Passwort mit mindestens 6 Zeichen für dein Konto."],
    "Вы уже зарегистрированы в этом режиме.":["You are already registered in this mode.","Du bist in diesem Modus bereits angemeldet."],
    "Не удалось отправить заявку.":["Could not send the application.","Die Anmeldung konnte nicht gesendet werden."],

    /* аккаунт */
    "Вход":["Log in","Anmelden"],
    "Войти":["Log in","Anmelden"],
    "Создать аккаунт":["Create account","Konto erstellen"],
    "Забыли пароль?":["Forgot password?","Passwort vergessen?"],
    "Пароль":["Password","Passwort"],
    "Steam (ссылка)":["Steam (link)","Steam (Link)"],
    "Сохранить":["Save","Speichern"],
    "Отправить письмо ещё раз":["Resend email","E-Mail erneut senden"],
    "Записаться на турнир":["Join a tournament","Zum Turnier anmelden"],
    "Открыть админку":["Open admin panel","Adminbereich öffnen"],
    "Выйти":["Log out","Abmelden"],
    "Заявок пока нет.":["No applications yet.","Noch keine Anmeldungen."],
    "На проверке":["Under review","In Prüfung"],
    "Принята":["Accepted","Angenommen"],
    "Отклонена":["Declined","Abgelehnt"],
    "Демо-режим: аккаунты и заявки хранятся только в этом браузере.":["Demo mode: accounts and applications are stored only in this browser.","Demo-Modus: Konten und Anmeldungen werden nur in diesem Browser gespeichert."],
    "Если такая почта зарегистрирована, на неё отправлено письмо со ссылкой для нового пароля (проверьте «Спам»).":["If this email is registered, a message with a link to set a new password has been sent (check your spam folder).","Wenn diese E-Mail registriert ist, wurde ihr eine Nachricht mit einem Link für ein neues Passwort gesendet (prüfe den Spam-Ordner)."],
    "Введите почту и пароль не короче 6 символов.":["Enter your email and a password of at least 6 characters.","Gib deine E-Mail und ein Passwort mit mindestens 6 Zeichen ein."],
    "Введите почту, на которую придёт письмо.":["Enter the email the message should be sent to.","Gib die E-Mail ein, an die die Nachricht gehen soll."],
    "Не удалось отправить письмо.":["Could not send the email.","Die E-Mail konnte nicht gesendet werden."],
    "Эта почта уже зарегистрирована.":["This email is already registered.","Diese E-Mail ist bereits registriert."],
    "Неверная почта или пароль.":["Wrong email or password.","Falsche E-Mail oder falsches Passwort."],
    "В демо-режиме восстановление пароля недоступно.":["Password recovery is unavailable in demo mode.","Im Demo-Modus ist die Passwort-Wiederherstellung nicht verfügbar."],
    "Пароль слишком короткий (минимум 6 символов).":["Password is too short (at least 6 characters).","Das Passwort ist zu kurz (mindestens 6 Zeichen)."],
    "Неверная почта.":["Invalid email.","Ungültige E-Mail."],
    "В Firebase не включён вход по почте и паролю (Authentication → Sign-in method → Email/Password).":["Email/password sign-in is not enabled in Firebase (Authentication → Sign-in method → Email/Password).","In Firebase ist die Anmeldung per E-Mail und Passwort nicht aktiviert (Authentication → Sign-in method → Email/Password)."],
    "Домен сайта не добавлен в Authorized domains в Firebase.":["The site domain is not added to Authorized domains in Firebase.","Die Domain der Seite ist in Firebase nicht unter Authorized domains eingetragen."],
    "Нет связи с Firebase.":["No connection to Firebase.","Keine Verbindung zu Firebase."],
    "Неверный apiKey в конфиге Firebase.":["Invalid apiKey in the Firebase config.","Ungültiger apiKey in der Firebase-Konfiguration."],
    "Почта подтверждена ✓":["Email confirmed ✓","E-Mail bestätigt ✓"],
    "Почта не подтверждена. Проверьте письмо (и папку «Спам»).":["Email not confirmed. Check your inbox (and the spam folder).","E-Mail nicht bestätigt. Prüfe dein Postfach (und den Spam-Ordner)."],
    "Письмо отправлено. Проверьте почту и папку «Спам».":["Email sent. Check your inbox and the spam folder.","E-Mail gesendet. Prüfe dein Postfach und den Spam-Ordner."],
    "Не удалось отправить, попробуйте позже.":["Could not send, please try again later.","Senden fehlgeschlagen, bitte später erneut versuchen."],
    "Открыть профиль Steam":["Open Steam profile","Steam-Profil öffnen"],
    "Steam не указан.":["Steam not set.","Steam nicht angegeben."],
    "Введите ник и ссылку вида steamcommunity.com/...":["Enter a nickname and a link like steamcommunity.com/...","Gib einen Nickname und einen Link wie steamcommunity.com/... ein."],
    "· сохранено":["· saved","· gespeichert"],
    "Не удалось сохранить.":["Could not save.","Speichern fehlgeschlagen."],
    "Пока без места в рейтинге":["Not ranked yet","Noch nicht platziert"],
    "Ср. убийства":["Avg. kills","Ø Kills"],
    "Ср. смерти":["Avg. deaths","Ø Tode"],

    /* топ */
    "Рейтинг":["Ranking","Rangliste"],
    "Топ игроков":["Top players","Top-Spieler"],
    "Убийства":["Kills","Kills"],
    "Смерти":["Deaths","Tode"],
    "Загрузка…":["Loading…","Lädt…"],
    "Статистики пока нет.":["No stats yet.","Noch keine Statistik."],
    "Не удалось загрузить рейтинг.":["Could not load the ranking.","Rangliste konnte nicht geladen werden."],

    /* админка */
    "Управление":["Management","Verwaltung"],
    "Настройки":["Settings","Einstellungen"],
    "Админы":["Admins","Admins"],
    "Дата и время старта турнира":["Tournament start date and time","Startdatum und -zeit des Turniers"],
    "Сохранить дату":["Save date","Datum speichern"],
    "Почта нового админа":["New admin's email","E-Mail des neuen Admins"],
    "Или выберите из зарегистрированных":["Or pick from registered users","Oder aus registrierten Nutzern wählen"],
    "Подставить эту почту":["Use this email","Diese E-Mail verwenden"],
    "Добавить админа":["Add admin","Admin hinzufügen"],
    "Сохраняем…":["Saving…","Speichern…"],
    "Новый админ войдёт на сайт под этой почтой и сразу увидит раздел «Админка». Добавлять и убирать админов может только владелец.":["The new admin will sign in with this email and will immediately see the “Admin” section. Only the owner can add and remove admins.","Der neue Admin meldet sich mit dieser E-Mail an und sieht sofort den Bereich „Admin“. Nur der Besitzer kann Admins hinzufügen und entfernen."],
    "Добавить игрока вручную":["Add player manually","Spieler manuell hinzufügen"],
    "Напарник":["Teammate","Partner"],
    "Ссылка Steam (необязательно)":["Steam link (optional)","Steam-Link (optional)"],
    "Добавить в сетку":["Add to bracket","Zum Turnierbaum hinzufügen"],
    "Статистика игрока":["Player stats","Spielerstatistik"],
    "Игрок":["Player","Spieler"],
    "Убийства в матче":["Kills in match","Kills im Match"],
    "Смерти в матче":["Deaths in match","Tode im Match"],
    "Добавить матч":["Add match","Match hinzufügen"],
    "Обнулить игрока":["Reset player","Spieler zurücksetzen"],
    "Статус":["Status","Status"],
    "профиль":["profile","Profil"],
    "Принять":["Accept","Annehmen"],
    "Отклонить":["Decline","Ablehnen"],
    "Удалить":["Delete","Löschen"],
    "В 1×1":["To 1×1","Zu 1×1"],
    "В 2×2":["To 2×2","Zu 2×2"],
    "Убрать":["Remove","Entfernen"],
    "владелец":["owner","Besitzer"],
    "добавлено админом":["added by admin","vom Admin hinzugefügt"],
    "Других админов нет.":["No other admins.","Keine weiteren Admins."],
    "Подключение к базе загружается…":["Connecting to the database…","Verbindung zur Datenbank wird aufgebaut…"],
    "Не удалось загрузить заявки.":["Could not load applications.","Anmeldungen konnten nicht geladen werden."],
    "Сначала войдите в аккаунт владельца.":["Please sign in to the owner account first.","Melde dich zuerst mit dem Besitzerkonto an."],
    "Добавлять админов может только владелец аккаунта.":["Only the account owner can add admins.","Nur der Kontobesitzer kann Admins hinzufügen."],
    "Введите настоящую почту, например admin@mail.com.":["Enter a real email, for example admin@mail.com.","Gib eine echte E-Mail ein, zum Beispiel admin@mail.com."],
    "Это почта владельца — он уже админ.":["This is the owner's email — they are already an admin.","Das ist die E-Mail des Besitzers — er ist bereits Admin."],
    "Этот админ уже добавлен.":["This admin has already been added.","Dieser Admin wurde bereits hinzugefügt."],
    "База данных ещё загружается. Подождите пару секунд и нажмите ещё раз.":["The database is still loading. Wait a couple of seconds and try again.","Die Datenbank lädt noch. Warte kurz und versuche es erneut."],
    "База данных не ответила. Проверьте интернет и попробуйте ещё раз.":["The database did not respond. Check your connection and try again.","Die Datenbank hat nicht geantwortet. Prüfe deine Verbindung und versuche es erneut."],
    "Firebase запретил запись списка админов. В Firebase → Firestore → Rules разрешите владельцу запись в cfg/admins и cfg/main.":["Firebase denied writing the admin list. In Firebase → Firestore → Rules, allow the owner to write to cfg/admins and cfg/main.","Firebase hat das Schreiben der Admin-Liste verweigert. Erlaube dem Besitzer in Firebase → Firestore → Rules das Schreiben in cfg/admins und cfg/main."],
    "Нет связи с базой. Попробуйте ещё раз.":["No connection to the database. Please try again.","Keine Verbindung zur Datenbank. Bitte erneut versuchen."],
    "Не удалось сохранить изменения. Попробуйте ещё раз.":["Could not save the changes. Please try again.","Änderungen konnten nicht gespeichert werden. Bitte erneut versuchen."],
    "Выберите игрока и введите убийства и смерти.":["Choose a player and enter kills and deaths.","Wähle einen Spieler und gib Kills und Tode ein."],
    "Матч добавлен.":["Match added.","Match hinzugefügt."],
    "Статистика обнулена.":["Stats reset.","Statistik zurückgesetzt."],
    "Обнулить статистику игрока?":["Reset this player's stats?","Statistik dieses Spielers zurücksetzen?"],
    "Счёт по картам, например 3:1 (до трёх побед). Пусто — очистить.":["Map score, e.g. 3:1 (first to three). Leave empty to clear.","Kartenergebnis, z. B. 3:1 (bis drei Siege). Leer lassen zum Löschen."],
    "Счёт матча, например 13:9. Пусто — очистить.":["Match score, e.g. 13:9. Leave empty to clear.","Matchergebnis, z. B. 13:9. Leer lassen zum Löschen."],
    "Формат: 13:9":["Format: 13:9","Format: 13:9"],
    "Ничья невозможна":["A draw is not possible","Unentschieden ist nicht möglich"],
    "В финале до трёх карт: 3:0, 3:1 или 3:2":["The final is first to three maps: 3:0, 3:1 or 3:2","Im Finale geht es bis drei Karten: 3:0, 3:1 oder 3:2"],
    "Не удалось сохранить счёт":["Could not save the score","Ergebnis konnte nicht gespeichert werden"],

    /* награды (awards.js) */
    "Турнир":["Tournament","Turnier"],
    "Награда":["Award","Auszeichnung"],
    "Награда за турнир":["Tournament award","Turnierauszeichnung"],
    "1 место (кубок)":["1st place (trophy)","1. Platz (Pokal)"],
    "2 место (серебро)":["2nd place (silver)","2. Platz (Silber)"],
    "3 место (бронза)":["3rd place (bronze)","3. Platz (Bronze)"],
    "Выдать награду":["Give award","Auszeichnung vergeben"],
    "Снять награду":["Remove award","Auszeichnung entziehen"],
    "Выдать MVP":["Give MVP","MVP vergeben"],
    "Снять MVP":["Remove MVP","MVP entziehen"],
    "Выберите игрока.":["Choose a player.","Wähle einen Spieler."],
    "Награда выдана.":["Award given.","Auszeichnung vergeben."],
    "Награда снята.":["Award removed.","Auszeichnung entzogen."],
    "MVP выдан.":["MVP given.","MVP vergeben."],
    "MVP снят.":["MVP removed.","MVP entzogen."],
    "Не удалось сохранить награду.":["Could not save the award.","Auszeichnung konnte nicht gespeichert werden."],
    "Кубок, 1 место":["Trophy, 1st place","Pokal, 1. Platz"],
    "Серебряная медаль, 2 место":["Silver medal, 2nd place","Silbermedaille, 2. Platz"],
    "Бронзовая медаль, 3 место":["Bronze medal, 3rd place","Bronzemedaille, 3. Platz"]
  };
  D[WHY]=["We need your email to create your account and let you sign in, to confirm it's you (we send a message with a link), to recover your password and to contact you about the tournament. Your email is visible to the organizer and tournament admins, and the data is stored in Google Firebase. To delete your data, message the organizer in the “Contact” section.","Wir brauchen deine E-Mail, um dein Konto zu erstellen und dich anzumelden, um zu bestätigen, dass du es bist (wir senden eine Nachricht mit Link), um das Passwort wiederherzustellen und dich zum Turnier zu kontaktieren. Die E-Mail sehen der Veranstalter und die Turnier-Admins, die Daten werden bei Google Firebase gespeichert. Um deine Daten zu löschen, schreibe dem Veranstalter im Bereich „Kontakt“."];

  /* ---------- шаблоны для строк с переменными частями ---------- */
  var ORD=["","1st","2nd","3rd"];
  function st(m,i){return D[m][i]}
  var R=[
    [/^(1×1|2×2) · принято (\d+) из 16$/,"$1 · accepted $2 of 16","$1 · angenommen $2 von 16"],
    [/^Место в рейтинге: (\d+)$/,"Rank: $1","Platz in der Rangliste: $1"],
    [/^(\d+) игроков$/,"$1 players","$1 Spieler"],
    [/^(\d+) пар$/,"$1 pairs","$1 Paare"],
    [/^(\d) место( ×\d+)?$/,function(m){return ORD[m[1]]+" place"+(m[2]||"")},function(m){return m[1]+". Platz"+(m[2]||"")}],
    [/^(\d+ : \d+) \(карты\)$/,"$1 (maps)","$1 (Karten)"],
    [/^(1×1|2×2) · (.*) · (На проверке|Принята|Отклонена)$/,function(m){return m[1]+" · "+m[2]+" · "+st(m[3],0)},function(m){return m[1]+" · "+m[2]+" · "+st(m[3],1)}],
    [/^Готово: (.+) добавлен в админы\. Войдите под этой почтой — раздел «Админка» появится в меню\.$/,"Done: $1 is now an admin. Sign in with this email — the “Admin” section will appear in the menu.","Fertig: $1 ist jetzt Admin. Melde dich mit dieser E-Mail an — der Bereich „Admin“ erscheint im Menü."],
    [/^Почта выбрана: (.+) — нажмите «Добавить админа»\.$/,"Email selected: $1 — click “Add admin”.","E-Mail ausgewählt: $1 — klicke auf „Admin hinzufügen“."],
    [/^Админ убран: (.+)$/,"Admin removed: $1","Admin entfernt: $1"],
    [/^Убрать админа (.+)\?$/,"Remove admin $1?","Admin $1 entfernen?"],
    [/^Не удалось сохранить изменения: (.+)\. Попробуйте ещё раз\.$/,"Could not save the changes: $1. Please try again.","Änderungen konnten nicht gespeichert werden: $1. Bitte erneut versuchen."],
    [/^Ошибка: (.+)$/,"Error: $1","Fehler: $1"]
  ];

  function has_(k){return has.call(D,k)}
  function tc(c){
    var i=IDX[lang];
    if(has_(c))return D[c][i];
    for(var k=0;k<R.length;k++){
      var mm=c.match(R[k][0]);
      if(mm){var t=R[k][1+i];return typeof t==="function"?t(mm):c.replace(R[k][0],t)}
    }
    return c;
  }
  function tl(s){
    if(lang==="ru"||typeof s!=="string")return s;
    var m=s.match(/^(\s*)([\s\S]*?)(\s*)$/);
    if(!m[2])return s;
    var out=tc(m[2]);
    return out===m[2]?s:m[1]+out+m[3];
  }

  /* ---------- применение к DOM ---------- */
  var ATTRS=["title","aria-label","placeholder"];
  function trText(n){
    var cur=n.nodeValue,ru;
    if(n.__tr!==undefined&&cur===n.__tr)ru=n.__ru;else{ru=cur;n.__ru=cur}
    var out=lang==="ru"?ru:tl(ru);
    if(out!==cur)n.nodeValue=out;
    n.__tr=out;
  }
  function trAttr(el,a){
    var v=el.getAttribute(a);if(v==null)return;
    var rec=el.__ra||(el.__ra={}),r=rec[a],ru=(r&&r.tr===v)?r.ru:v;
    var out=lang==="ru"?ru:tl(ru);
    if(out!==v)el.setAttribute(a,out);
    rec[a]={ru:ru,tr:out};
  }
  function trEl(el){ATTRS.forEach(function(a){if(el.hasAttribute&&el.hasAttribute(a))trAttr(el,a)})}
  function walk(root){
    if(root.nodeType===3){if(root.parentNode&&!/^(SCRIPT|STYLE)$/.test(root.parentNode.nodeName))trText(root);return}
    if(root.nodeType!==1)return;
    if(/^(SCRIPT|STYLE)$/.test(root.nodeName))return;
    trEl(root);
    var tw=document.createTreeWalker(root,5,{acceptNode:function(n){
      return (n.nodeType===1&&/^(SCRIPT|STYLE)$/.test(n.nodeName))?2:1;
    }});
    var n;while((n=tw.nextNode())){if(n.nodeType===3)trText(n);else trEl(n)}
  }

  var obs=null,OPT={childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:ATTRS};
  function guard(fn){if(obs)obs.disconnect();try{fn()}finally{if(obs)obs.observe(document.body,OPT)}}
  function applyAll(){guard(function(){walk(document.body);document.documentElement.lang=lang})}

  obs=new MutationObserver(function(recs){
    if(lang==="ru")return;
    guard(function(){
      recs.forEach(function(r){
        if(r.type==="childList")r.addedNodes.forEach(walk);
        else if(r.type==="characterData")trText(r.target);
        else if(r.type==="attributes")trAttr(r.target,r.attributeName);
      });
    });
  });

  /* alert / confirm / prompt тоже переводим */
  ["alert","confirm","prompt"].forEach(function(n){
    var o=window[n];if(typeof o!=="function")return;
    window[n]=function(a,b){return o.call(window,tl(a),b)};
  });

  /* ---------- переключатель RU / EN / DE ---------- */
  var css=document.createElement("style");
  css.textContent=".lang{display:flex;gap:.2rem;padding:.2rem;border:1px solid var(--line,#3a2217);border-radius:999px;background:var(--surface,#171010)}"
   +".lang button{min-width:2.4rem;padding:.3rem .6rem;border:0;border-radius:999px;background:none;color:var(--muted,#a09088);font:700 .74rem var(--mono,monospace);letter-spacing:.08em;cursor:pointer;touch-action:manipulation;transition:color .2s ease,background-color .2s ease}"
   +".lang button:hover{color:var(--ink,#f6ede7)}"
   +".lang button.on{color:#fff;background:linear-gradient(180deg,var(--or,#ff6a2b),var(--or2,#f2501a))}"
   +"@media (max-width:640px){.lang{margin-left:auto;margin-right:.3rem}.lang button{min-width:2.6rem;min-height:36px}.burger{margin-left:0}}";
  document.head.appendChild(css);

  var box=document.createElement("div");
  box.className="lang";box.setAttribute("role","group");box.setAttribute("aria-label","Язык");
  box.innerHTML=LANGS.map(function(l){return '<button type="button" data-l="'+l+'">'+l.toUpperCase()+'</button>'}).join("");
  var bar=document.querySelector("header .bar"),burger=document.getElementById("nav-toggle");
  if(bar){if(burger)bar.insertBefore(box,burger);else bar.appendChild(box)}
  function mark(){box.querySelectorAll("button").forEach(function(b){var on=b.dataset.l===lang;b.classList.toggle("on",on);b.setAttribute("aria-pressed",on?"true":"false")})}
  function setLang(l){
    if(LANGS.indexOf(l)<0)return;
    lang=l;try{localStorage.setItem("ah_lang",l)}catch(e){}
    mark();applyAll();
  }
  box.addEventListener("click",function(e){var b=e.target.closest("button[data-l]");if(b)setLang(b.dataset.l)});
  window.ahSetLang=setLang;

  mark();
  applyAll();
  obs.observe(document.body,OPT);
})();
