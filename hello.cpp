#include <string>
#include <fstream>
#include <streambuf>
#include <iostream>
#include <complex>

#include <napi.h>

#define STB_DEFINE
#include "stb/stb.h"
#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "stb/stb_image_write.h"


using namespace std;

std::string readFile(const char *filename)
{
  std::ifstream t(filename);
  std::string str;

  t.seekg(0, std::ios::end);
  str.reserve(t.tellg());
  t.seekg(0, std::ios::beg);

  str.assign((std::istreambuf_iterator<char>(t)), std::istreambuf_iterator<char>());
  return str;
}


// ========= write PNG to file

float width = 600;
float height = 600;

int value(int x, int y)
{
  complex<float> point((float)x / width - 1.5, (float)y / height - 0.5);
  complex<float> z(0, 0);
  unsigned int nb_iter = 0;
  while (abs(z) < 2 && nb_iter <= 34)
  {
    z = z * z + point;
    nb_iter++;
  }
  if (nb_iter < 34)
  {
    return (255 * nb_iter) / 33;
  }
  else
    return 0;
}

void compute()
{
  constexpr size_t CHANNEL_NUM = 3;
  uint8_t *pixels = new uint8_t[(size_t)width * (size_t)height * CHANNEL_NUM];

  size_t index = 0;
  for (int i = 0; i < width; i++)
  {
    for (int j = 0; j < height; j++)
    {
      float r = (float)value(i, j);
      float g = 0.f;
      float b = 0.f;
      int ir = int(255.99 * r);
      int ig = int(255.99 * g);
      int ib = int(255.99 * b);

      pixels[index++] = ir;
      pixels[index++] = ig;
      pixels[index++] = ib;
    }
  }
  stbi_write_png("mandelbrot.png", (int)width, (int)height, CHANNEL_NUM, pixels, (int)width * CHANNEL_NUM);
}

// ========== end of writing to disk

// ========== write to buffer



// ========== end of buffer write

Napi::String Method(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();
  auto msg = readFile("test.txt");
  return Napi::String::New(env, msg);
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
  exports.Set(Napi::String::New(env, "hello"),
              Napi::Function::New(env, Method));
  return exports;
}

NODE_API_MODULE(hello, Init)