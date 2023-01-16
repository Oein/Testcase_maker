#include <iostream>
#include <algorithm>
#include <stack>
#include <queue>
#include <vector>
#include <cmath>
#include <cstring>
#include <cstdlib>
#include <fstream>
#include <random>

using namespace std;

int main()
{
    string x;
    getline(cin, x);
    for (int i = 0; i < x.size(); i++)
    {
        char g = x[i];
        if (g >= 'a' && g <= 'z')
        {
            g -= 32;
        }
        else if (g >= 'A' && g <= 'Z')
        {
            g += 32;
        }
    }
    cout << x;
}