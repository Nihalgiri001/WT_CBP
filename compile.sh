set -e
TOMCAT_HOME="$HOME/tomcat"
APP_DIR="$TOMCAT_HOME/webapps/TokenQueueApp"
SRC_DIR="$APP_DIR/WEB-INF/src"
OUT_DIR="$APP_DIR/WEB-INF/classes"
SERVLET_JAR="$TOMCAT_HOME/lib/servlet-api.jar"

if [ ! -f "$SERVLET_JAR" ]; then
  echo "ERROR: servlet-api.jar not found at $SERVLET_JAR"
  exit 1
fi
mkdir -p "$OUT_DIR/com/tokenqueue"
javac -cp "$SERVLET_JAR" \
      --release 11 \
      -d "$OUT_DIR" \
      "$SRC_DIR"/*.java
