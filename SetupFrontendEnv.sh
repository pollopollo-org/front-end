echo ""
echo "****************************"
echo "* Installing Node.js, npm & yarn *"
echo "****************************"
echo ""

sudo apt update
sudo apt install nodejs
sudo apt install npm
sudo npm install yarn -g


echo ""
echo "*************************"
echo "* Installing TypeScript *"
echo "*************************"
echo ""

sudo npm install -g typescript tslint

