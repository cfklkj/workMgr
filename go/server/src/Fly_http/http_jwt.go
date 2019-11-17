package Fly_http

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/dgrijalva/jwt-go"
	"github.com/dgrijalva/jwt-go/request"
)

func (c *Http) generateToken(proName, key string) (string, error) {
	mapClaims := make(jwt.MapClaims)
	mapClaims["proName"] = proName
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, mapClaims)
	return token.SignedString([]byte(key))
}

//解析token
func (c *Http) getTokensData(key string, tokenStr string) (string, int) {
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return []byte(key), nil
	})

	if err != nil {
		fmt.Println("getTokenJson", "err", err)
		return "", Err_token
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		value, ok := claims["proName"]
		if ok {
			data := c.ToString(value)
			return data, Err_null
		}
		fmt.Println("claims--", claims, value, ok)
	} else {
		fmt.Println(err)
	}
	return "", Err_token
}

//解析token
func (c *Http) getTokenData(key string, r *http.Request) (string, int) {
	token, err := request.ParseFromRequest(r, request.AuthorizationHeaderExtractor,
		func(token *jwt.Token) (interface{}, error) {
			return []byte(key), nil
		})

	if err != nil || token == nil {
		tokenString, _ := r.Header["Authorization"]
		fmt.Println("getTokenJson", "err", err, tokenString)
		return "", Err_token
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		value, ok := claims["proName"]
		if ok {
			data := c.ToString(value)
			return data, Err_null
		}
		fmt.Println("claims--", claims, value, ok)
	} else {
		fmt.Println(err)
	}
	return "", Err_token
}

//解析appid
func (c *Http) ToString(data interface{}) string {
	switch data.(type) {
	case int:
		return strconv.Itoa(data.(int))
	case string:
		return data.(string)
	case float64:
		return strconv.Itoa(int(data.(float64)))
	default:
		return ""
	}
}
