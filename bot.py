from telegram import Update
   from telegram.ext import Updater, CommandHandler, CallbackContext

   def start(update: Update, context: CallbackContext):
       update.message.reply_text(
           "📿 Ваш Тасбих-счётчик: https://itjmu.github.io/TR_v1/"
       )

   def main():
       updater = Updater(6797867580:AAFjm5Ig4jxMNjQgGt793DIL3A1Gw2uNX_U")
       dispatcher = updater.dispatcher
       dispatcher.add_handler(CommandHandler('start', start))
       updater.start_polling()
       updater.idle()

   if __name__ == "__main__":
       main()
